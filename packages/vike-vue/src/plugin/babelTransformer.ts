import MagicString from 'magic-string'
import { parseSync } from 'oxc-parser'
import { walk } from 'oxc-walker'
import type {
  Program,
  CallExpression,
  Expression,
  Argument,
  StaticMemberExpression,
  ComputedMemberExpression,
} from 'oxc-parser'

// ============================================================================
// Public API
// ============================================================================

/**
 * Condition to match an argument value.
 * - string starting with 'import:' matches an imported identifier
 * - { prop, equals } matches a property value inside an object argument
 * - { call, args } matches a call expression with specific arguments
 * - { member, object, property } matches a member expression like $setup["ClientOnly"]
 */
export type ArgCondition =
  | string
  | { prop: string; equals: unknown }
  | { call: string; args?: Record<number, ArgCondition> }
  | { member: true; object: string; property: string | ArgCondition }

/**
 * Target for replace operation.
 */
export type ReplaceTarget =
  | { with: unknown } // Replace the entire call expression
  | { arg: number; prop: string; with: unknown } // Replace a prop inside an object arg
  | { arg: number; with: unknown } // Replace entire argument
  | { argsFrom: number; with: unknown } // Replace all args from index onwards with a single value

/**
 * Target for remove operation.
 */
export type RemoveTarget =
  | { arg: number; prop: string } // Remove a prop inside an object arg
  | { arg: number } // Remove entire argument
  | { argsFrom: number } // Remove all args from index onwards

/**
 * Rule for function call replacement/removal.
 */
export type CallRule = {
  call: {
    /** Match criteria */
    match: {
      /**
       * Function name(s) to match.
       * - Plain string: matches function name directly (e.g., 'jsx')
       * - Import string: 'import:source:exportName' (e.g., 'import:react/jsx-runtime:jsx')
       */
      function: string | string[]
      /** Conditions on arguments: index -> condition */
      args?: Record<number, ArgCondition>
    }
    /** Replace target (optional) */
    replace?: ReplaceTarget
    /** Remove target (optional) */
    remove?: RemoveTarget
  }
}

/**
 * Rule for static replacement/removal.
 * Currently only supports function call rules, but can be extended in the future.
 *
 * @example
 * // jsx/jsxs/jsxDEV: replace children prop with null
 * {
 *   call: {
 *     match: {
 *       function: ['jsx', 'jsxs', 'jsxDEV'],
 *       args: { 0: 'import:vike-react/ClientOnly:ClientOnly' }
 *     },
 *     replace: { arg: 1, prop: 'children', with: null }
 *   }
 * }
 *
 * @example
 * // createElement: remove all children (args from index 2)
 * {
 *   call: {
 *     match: {
 *       function: 'createElement',
 *       args: { 0: 'import:vike-react/ClientOnly:ClientOnly' }
 *     },
 *     remove: { argsFrom: 2 }
 *   }
 * }
 *
 * @example
 * // ssrRenderComponent: match nested call expression and remove default slot
 * {
 *   call: {
 *     match: {
 *       function: 'import:vue/server-renderer:ssrRenderComponent',
 *       args: {
 *         0: {
 *           call: 'import:vue:unref',
 *           args: { 0: 'import:vike-vue/ClientOnly:ClientOnly' }
 *         }
 *       }
 *     },
 *     remove: { arg: 2, prop: 'default' }
 *   }
 * }
 */
export type ReplaceRule = CallRule & {
  /** Environment filter: 'client' = client only, 'server' = everything except client */
  env?: 'server' | 'client'
} // Can be extended: CallRule | VariableRule | ...

export type TransformOptions = {
  rules: ReplaceRule[]
}

// ============================================================================
// Internal types
// ============================================================================

type TransformResult = { code: string; map: any } | null

type ParsedImport = { source: string; exportName: string }

type State = {
  /** Map: localName -> { source, exportName } */
  imports: Map<string, ParsedImport>
}

// ============================================================================
// Main transformer
// ============================================================================

export type TransformInput = {
  code: string
  id: string
  env: string
  options: TransformOptions
}

export async function transformCode({ code, id, env, options }: TransformInput): Promise<TransformResult> {
  // 'server' means "not client" (covers ssr, cloudflare, etc.)
  const filteredRules = options.rules.filter((rule) => {
    if (!rule.env) return true
    if (rule.env === 'client') return env === 'client'
    if (rule.env === 'server') return env !== 'client'
    return false
  })

  if (filteredRules.length === 0) {
    return null
  }

  try {
    const s = new MagicString(code)
    const state: State = {
      imports: new Map(),
    }

    const result = parseSync(id, code)
    const ast = result.program

    // Collect imports
    collectImports(ast, state)

    // Apply rules
    const modified = applyRules(ast, filteredRules, state, s)

    if (!modified) {
      return null
    }

    // Remove unreferenced imports
    removeUnreferencedImports(ast, s, state)

    return { code: s.toString(), map: s.generateMap({ hires: true }) }
  } catch (error) {
    console.error(`Error transforming ${id}:`, error)
    return null
  }
}

// ============================================================================
// Helpers
// ============================================================================

function parseImportString(str: string): ParsedImport | null {
  if (!str.startsWith('import:')) return null
  const rest = str.slice('import:'.length)
  const parts = rest.split(':')
  const exportName = parts.pop()!
  const source = parts.join(':')
  return { source, exportName }
}

function getCalleeName(callee: Expression): string | null {
  if (callee.type === 'Identifier') return callee.name
  if (callee.type === 'MemberExpression' && !callee.computed) {
    // StaticMemberExpression
    return (callee as StaticMemberExpression).property.name
  }
  return null
}

/**
 * Check if an identifier matches an import condition
 */
function matchesImport(arg: Expression, parsed: ParsedImport, state: State): boolean {
  if (arg.type !== 'Identifier') return false
  const imported = state.imports.get(arg.name)
  if (!imported) return false
  return imported.source === parsed.source && imported.exportName === parsed.exportName
}

// ============================================================================
// Implementation functions
// ============================================================================

/**
 * Collect all imports: localName -> { source, exportName }
 */
function collectImports(program: Program, state: State): void {
  for (const node of program.body) {
    if (node.type !== 'ImportDeclaration') continue

    const source = node.source.value

    for (const specifier of node.specifiers) {
      let exportName: string
      if (specifier.type === 'ImportSpecifier' && specifier.imported.type === 'Identifier') {
        exportName = specifier.imported.name
      } else if (specifier.type === 'ImportDefaultSpecifier') {
        exportName = 'default'
      } else {
        continue
      }

      state.imports.set(specifier.local.name, { source, exportName })
    }
  }
}

/**
 * Apply replacement rules to matching call expressions
 * Returns true if any modifications were made
 */
function applyRules(program: Program, rules: ReplaceRule[], state: State, s: MagicString): boolean {
  let modified = false

  walk(program, {
    enter(node) {
      if (node.type !== 'CallExpression') return

      const calleeName = getCalleeName(node.callee)
      if (!calleeName) return

      for (const rule of rules) {
        if (!matchesRule(node, rule, calleeName, state)) continue
        if (rule.call.replace) {
          applyReplace(node, rule.call.replace, state, s)
          modified = true
        } else if (rule.call.remove) {
          applyRemove(node, rule.call.remove, s)
          modified = true
        }
      }
    },
  })

  return modified
}

/**
 * Check if a call expression matches a rule
 */
function matchesRule(node: CallExpression, rule: ReplaceRule, calleeName: string, state: State): boolean {
  const { match } = rule.call

  // Check callee name
  const functions = Array.isArray(match.function) ? match.function : [match.function]
  if (!matchesCallee(node.callee, calleeName, functions, state)) return false

  // Check argument conditions
  if (match.args) {
    for (const [indexStr, condition] of Object.entries(match.args)) {
      const index = Number(indexStr)
      const arg = node.arguments[index]
      if (!arg) return false

      if (!matchesCondition(arg, condition, state)) return false
    }
  }

  return true
}

/**
 * Check if callee matches any of the function patterns
 */
function matchesCallee(callee: Expression, calleeName: string, functions: string[], state: State): boolean {
  for (const fn of functions) {
    const parsed = parseImportString(fn)

    if (parsed) {
      // Import string: check if callee is an imported identifier
      if (callee.type === 'Identifier') {
        const imported = state.imports.get(callee.name)
        if (imported && imported.source === parsed.source && imported.exportName === parsed.exportName) {
          return true
        }
      }
      // Import string: check member expression like React.createElement
      // where React is the default import and createElement is the method
      if (callee.type === 'MemberExpression' && !callee.computed) {
        const staticCallee = callee as StaticMemberExpression
        if (staticCallee.object.type === 'Identifier') {
          const imported = state.imports.get(staticCallee.object.name)
          if (
            imported &&
            imported.source === parsed.source &&
            imported.exportName === 'default' &&
            staticCallee.property.name === parsed.exportName
          ) {
            return true
          }
        }
      }
    } else {
      // Plain string: match function name directly
      if (calleeName === fn) return true
    }
  }

  return false
}

/**
 * Check if an argument matches a condition
 */
function matchesCondition(arg: Argument, condition: ArgCondition, state: State): boolean {
  if (arg.type === 'SpreadElement') return false

  // String condition
  if (typeof condition === 'string') {
    // Import condition: 'import:source:exportName'
    const parsed = parseImportString(condition)
    if (parsed) {
      return matchesImport(arg, parsed, state)
    }

    // Plain string: match string literal or identifier name
    if (arg.type === 'Literal' && typeof arg.value === 'string') return arg.value === condition
    if (arg.type === 'Identifier') return arg.name === condition
    return false
  }

  // Call expression condition: match call with specific arguments
  if ('call' in condition) {
    if (arg.type !== 'CallExpression') return false

    const calleeName = getCalleeName(arg.callee)
    if (!calleeName) return false

    // Check if callee matches
    const parsed = parseImportString(condition.call)
    if (parsed) {
      // Import string: check if callee is an imported identifier
      if (arg.callee.type !== 'Identifier') return false
      const imported = state.imports.get(arg.callee.name)
      if (!imported || imported.source !== parsed.source || imported.exportName !== parsed.exportName) {
        return false
      }
    } else {
      // Plain string: match function name directly
      if (calleeName !== condition.call) return false
    }

    // Check argument conditions
    if (condition.args) {
      for (const [indexStr, argCondition] of Object.entries(condition.args)) {
        const index = Number(indexStr)
        const nestedArg = arg.arguments[index]
        if (!nestedArg) return false
        if (!matchesCondition(nestedArg, argCondition, state)) return false
      }
    }

    return true
  }

  // Member expression condition: match $setup["ClientOnly"]
  if ('member' in condition) {
    if (arg.type !== 'MemberExpression') return false

    // Check object
    if (arg.object.type !== 'Identifier' || arg.object.name !== condition.object) return false

    // Check property
    if (typeof condition.property === 'string') {
      // Simple string property
      if (!arg.computed) {
        // StaticMemberExpression
        return (arg as StaticMemberExpression).property.name === condition.property
      }
      if (arg.computed) {
        // ComputedMemberExpression
        const computedArg = arg as ComputedMemberExpression
        if (computedArg.property.type === 'Literal' && typeof computedArg.property.value === 'string') {
          return computedArg.property.value === condition.property
        }
      }
      return false
    } else {
      // Nested condition on property (for future extensibility)
      return false
    }
  }

  // Object condition: match prop value inside an object argument
  if (arg.type !== 'ObjectExpression') return false

  for (const prop of arg.properties) {
    if (prop.type !== 'Property') continue
    if (prop.kind !== 'init') continue
    if (prop.key.type !== 'Identifier' || prop.key.name !== condition.prop) continue

    // Check value (all literals have type "Literal" in oxc)
    if (prop.value.type !== 'Literal') continue
    const value = prop.value.value

    if (condition.equals === null && value === null) return true
    if (condition.equals === true && value === true) return true
    if (condition.equals === false && value === false) return true
    if (typeof condition.equals === 'string' && value === condition.equals) return true
    if (typeof condition.equals === 'number' && value === condition.equals) return true
  }

  return false
}

/**
 * Apply a replacement to a call expression
 */
function applyReplace(node: CallExpression, replace: ReplaceTarget, _state: State, s: MagicString): void {
  // Replace the entire call expression
  if (!('arg' in replace) && !('argsFrom' in replace)) {
    s.overwrite(node.start, node.end, valueToString(replace.with))
    return
  }
  // Replace a prop inside an object argument
  if ('arg' in replace && 'prop' in replace) {
    const arg = node.arguments[replace.arg]
    if (!arg || arg.type === 'SpreadElement' || arg.type !== 'ObjectExpression') return

    for (const prop of arg.properties) {
      if (prop.type !== 'Property') continue
      if (prop.key.type !== 'Identifier' || prop.key.name !== replace.prop) continue

      s.overwrite(prop.value.start, prop.value.end, valueToString(replace.with))
      return
    }
  }
  // Replace entire argument
  else if ('arg' in replace) {
    if (node.arguments.length > replace.arg) {
      const arg = node.arguments[replace.arg]!
      s.overwrite(arg.start, arg.end, valueToString(replace.with))
    }
  }
  // Replace all args from index onwards with a single value
  else if ('argsFrom' in replace) {
    if (node.arguments.length > replace.argsFrom) {
      const firstArg = node.arguments[replace.argsFrom]!
      const lastArg = node.arguments[node.arguments.length - 1]!
      s.overwrite(firstArg.start, lastArg.end, valueToString(replace.with))
    }
  }
}

/**
 * Apply a removal to a call expression
 */
function applyRemove(node: CallExpression, remove: RemoveTarget, s: MagicString): void {
  // Remove a prop inside an object argument
  if ('prop' in remove) {
    const arg = node.arguments[remove.arg]
    if (!arg || arg.type === 'SpreadElement' || arg.type !== 'ObjectExpression') return

    const index = arg.properties.findIndex(
      (prop) => prop.type === 'Property' && prop.key.type === 'Identifier' && prop.key.name === remove.prop,
    )
    if (index !== -1) {
      const prop = arg.properties[index]!
      // Remove the property and any trailing comma
      let end = prop.end
      if (index < arg.properties.length - 1) {
        end = arg.properties[index + 1]!.start
      }
      s.remove(prop.start, end)
    }
  }
  // Remove entire argument
  else if ('arg' in remove) {
    if (node.arguments.length > remove.arg) {
      const arg = node.arguments[remove.arg]!
      // Remove the argument and handle commas
      let start = arg.start
      let end = arg.end
      if (remove.arg < node.arguments.length - 1) {
        // Not the last arg, remove up to next arg
        end = node.arguments[remove.arg + 1]!.start
      } else if (remove.arg > 0) {
        // Last arg, remove from previous arg end
        start = node.arguments[remove.arg - 1]!.end
      }
      s.remove(start, end)
    }
  }
  // Remove all args from index onwards
  else if ('argsFrom' in remove) {
    if (node.arguments.length > remove.argsFrom) {
      const firstArg = node.arguments[remove.argsFrom]!
      const lastArg = node.arguments[node.arguments.length - 1]!
      s.remove(firstArg.start, lastArg.end)
    }
  }
}

/**
 * Convert a value to its string representation
 */
function valueToString(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)
  return `JSON.parse(${JSON.stringify(JSON.stringify(value))})`
}

/**
 * Remove unreferenced imports after modifications
 */
function removeUnreferencedImports(program: Program, s: MagicString, _state: State): void {
  const usedIdentifiers = new Set<string>()

  // Collect all used identifiers
  walk(program, {
    enter(node) {
      if (node.type === 'Identifier') {
        usedIdentifiers.add(node.name)
      }
    },
  })

  // Check each import to see if it's still used
  for (const node of program.body) {
    if (node.type !== 'ImportDeclaration') continue

    const unusedSpecifiers: number[] = []

    for (let i = 0; i < node.specifiers.length; i++) {
      const specifier = node.specifiers[i]!
      // Count how many times this identifier appears (should be 1 for just the import)
      let count = 0
      walk(program, {
        enter(n) {
          if (n.type === 'Identifier' && n.name === specifier.local.name) {
            count++
          }
        },
      })

      // If only appears once (the import itself), it's unused
      if (count <= 1) {
        unusedSpecifiers.push(i)
      }
    }

    if (unusedSpecifiers.length === 0) continue

    if (unusedSpecifiers.length === node.specifiers.length) {
      // Remove entire import
      s.remove(node.start, node.end)
    } else {
      // Remove specific specifiers
      for (const i of unusedSpecifiers.reverse()) {
        const specifier = node.specifiers[i]!
        let start = specifier.start
        let end = specifier.end

        // Handle comma removal
        if (i < node.specifiers.length - 1) {
          // Not the last specifier, remove up to next
          end = node.specifiers[i + 1]!.start
        } else if (i > 0) {
          // Last specifier, remove from previous
          start = node.specifiers[i - 1]!.end
        }

        s.remove(start, end)
      }
    }
  }
}
