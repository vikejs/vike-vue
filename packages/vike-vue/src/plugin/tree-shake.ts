import MagicString from 'magic-string'
import { parseAndWalk, walk } from 'oxc-walker'
import type {
  BindingPattern,
  BindingProperty,
  CallExpression,
  Node,
  ObjectExpression,
  Program,
  ReturnStatement,
  VariableDeclaration,
} from 'oxc-parser'

const SSR_RENDER_RE = /ssrRenderComponent/
const PLACEHOLDER_EXACT_RE = /^(?:fallback|placeholder)$/
const CLIENT_ONLY_NAME_RE = /^(?:_unref\()?(?:_component_)?(?:Lazy|lazy_)?(?:ClientOnly\)?)$/
const CLIENT_ONLY_IN_CODE_RE = /ClientOnly/

export async function treeShake(code: string, id: string) {
  const s = new MagicString(code)

  if (!CLIENT_ONLY_IN_CODE_RE.test(code)) {
    return
  }

  const componentsToRemoveSet = new Set<string>()

  // Remove client only components or components called in ClientOnly default slot
  const { program: ast } = parseAndWalk(code, id, (node) => {
    if (!isSsrRender(node)) {
      return
    }

    const [componentCall, _, children] = node.arguments
    if (!componentCall) {
      return
    }

    if (
      componentCall.type === 'Identifier' ||
      componentCall.type === 'MemberExpression' ||
      componentCall.type === 'CallExpression'
    ) {
      const componentName = getComponentName(node)
      if (!componentName || !CLIENT_ONLY_NAME_RE.test(componentName) || children?.type !== 'ObjectExpression') {
        return
      }

      // Remove all slots except fallback/placeholder for ClientOnly
      const slotsToRemove = children.properties.filter(
        (prop) =>
          prop.type === 'Property' && prop.key.type === 'Identifier' && !PLACEHOLDER_EXACT_RE.test(prop.key.name),
      )

      for (const slot of slotsToRemove) {
        s.remove(slot.start, slot.end + 1)
        const removedCode = `({${code.slice(slot.start, slot.end + 1)}})`
        const currentState = s.toString()

        parseAndWalk(removedCode, id, (node) => {
          if (!isSsrRender(node)) {
            return
          }
          const name = getComponentName(node)
          if (!name) {
            return
          }

          // Detect if the component is called elsewhere
          const nameToRemove = isComponentNotCalledInSetup(currentState, id, name)
          if (nameToRemove) {
            componentsToRemoveSet.add(nameToRemove)
          }
        })
      }
    }
  })

  const componentsToRemove = [...componentsToRemoveSet]
  const removedNodes = new WeakSet<Node>()

  for (const componentName of componentsToRemove) {
    // Remove import declaration if it exists
    removeImportDeclaration(ast, componentName, s)
    // Remove variable declaration
    removeVariableDeclarator(ast, componentName, s, removedNodes)
    // Remove from setup return statement
    removeFromSetupReturn(ast, componentName, s)
  }

  if (s.hasChanged()) {
    return {
      code: s.toString(),
      map: s.generateMap({ hires: true }),
    }
  }
}

function removeFromSetupReturn(codeAst: Program, name: string, magicString: MagicString) {
  let walkedInSetup = false
  walk(codeAst, {
    enter(node) {
      if (walkedInSetup) {
        this.skip()
      } else if (
        node.type === 'Property' &&
        node.key.type === 'Identifier' &&
        node.key.name === 'setup' &&
        (node.value.type === 'FunctionExpression' || node.value.type === 'ArrowFunctionExpression')
      ) {
        walkedInSetup = true
        if (node.value.body?.type === 'BlockStatement') {
          const returnStatement = node.value.body.body.find(
            (statement) => statement.type === 'ReturnStatement',
          ) as ReturnStatement
          if (returnStatement && returnStatement.argument?.type === 'ObjectExpression') {
            removePropertyFromObject(returnStatement.argument, name, magicString)
          }

          const variableList = node.value.body.body.filter(
            (statement): statement is VariableDeclaration => statement.type === 'VariableDeclaration',
          )
          const returnedVariableDeclaration = variableList.find(
            (declaration) =>
              declaration.declarations[0]?.id.type === 'Identifier' &&
              declaration.declarations[0]?.id.name === '__returned__' &&
              declaration.declarations[0]?.init?.type === 'ObjectExpression',
          )
          if (returnedVariableDeclaration) {
            const init = returnedVariableDeclaration.declarations[0]?.init as ObjectExpression | undefined
            if (init) {
              removePropertyFromObject(init, name, magicString)
            }
          }
        }
      }
    },
  })
}

function removePropertyFromObject(node: ObjectExpression, name: string, magicString: MagicString) {
  for (const property of node.properties) {
    if (property.type === 'Property' && property.key.type === 'Identifier' && property.key.name === name) {
      magicString.remove(property.start, property.end + 1)
      return true
    }
  }
  return false
}

function isSsrRender(node: Node): node is CallExpression {
  return node.type === 'CallExpression' && node.callee.type === 'Identifier' && SSR_RENDER_RE.test(node.callee.name)
}

function removeImportDeclaration(ast: Program, importName: string, magicString: MagicString): boolean {
  for (const node of ast.body) {
    if (node.type !== 'ImportDeclaration' || !node.specifiers) {
      continue
    }
    const specifierIndex = node.specifiers.findIndex((s) => s.local.name === importName)
    if (specifierIndex > -1) {
      if (node.specifiers!.length > 1) {
        const specifier = node.specifiers![specifierIndex]!
        magicString.remove(specifier.start, specifier.end + 1)
        node.specifiers!.splice(specifierIndex, 1)
      } else {
        magicString.remove(node.start, node.end)
      }
      return true
    }
  }
  return false
}

function isComponentNotCalledInSetup(code: string, id: string, name: string): string | void {
  if (!name) {
    return
  }
  let found = false
  parseAndWalk(code, id, function (node) {
    if (
      (node.type === 'Property' &&
        node.key.type === 'Identifier' &&
        node.value.type === 'FunctionExpression' &&
        node.key.name === 'setup') ||
      (node.type === 'FunctionDeclaration' && (node.id?.name === '_sfc_ssrRender' || node.id?.name === 'ssrRender'))
    ) {
      walk(node, {
        enter(node) {
          if (found || node.type === 'VariableDeclaration') {
            this.skip()
          } else if (node.type === 'Identifier' && node.name === name) {
            found = true
          } else if (node.type === 'MemberExpression') {
            found =
              (node.property.type === 'Literal' && node.property.value === name) ||
              (node.property.type === 'Identifier' && node.property.name === name)
          }
        },
      })
    }
  })
  if (!found) {
    return name
  }
}

function getComponentName(ssrRenderNode: CallExpression): string | undefined {
  const componentCall = ssrRenderNode.arguments[0]
  if (!componentCall) {
    return
  }

  if (componentCall.type === 'Identifier') {
    return componentCall.name
  } else if (componentCall.type === 'MemberExpression') {
    if (componentCall.property.type === 'Literal') {
      return componentCall.property.value as string
    }
  } else if (componentCall.type === 'CallExpression') {
    return getComponentName(componentCall)
  }
}

function removeVariableDeclarator(
  codeAst: Program,
  name: string,
  magicString: MagicString,
  removedNodes: WeakSet<Node>,
): Node | void {
  walk(codeAst, {
    enter(node) {
      if (node.type !== 'VariableDeclaration') {
        return
      }
      for (const declarator of node.declarations) {
        const toRemove = findMatchingPatternToRemove(declarator.id, node, name, removedNodes)
        if (toRemove) {
          magicString.remove(toRemove.start, toRemove.end + 1)
          removedNodes.add(toRemove)
        }
      }
    },
  })
}

function findMatchingPatternToRemove(
  node: BindingPattern,
  toRemoveIfMatched: Node,
  name: string,
  removedNodeSet: WeakSet<Node>,
): Node | undefined {
  if (node.type === 'Identifier') {
    if (node.name === name) {
      return toRemoveIfMatched
    }
  } else if (node.type === 'ArrayPattern') {
    const elements = node.elements.filter((e): e is BindingPattern => e !== null && !removedNodeSet.has(e))

    for (const element of elements) {
      const matched = findMatchingPatternToRemove(
        element,
        elements.length > 1 ? element : toRemoveIfMatched,
        name,
        removedNodeSet,
      )
      if (matched) {
        return matched
      }
    }
  } else if (node.type === 'ObjectPattern') {
    const properties = node.properties.filter(
      (e): e is BindingProperty => e.type === 'Property' && !removedNodeSet.has(e),
    )

    for (const [index, property] of properties.entries()) {
      let nodeToRemove: Node = property
      if (properties.length < 2) {
        nodeToRemove = toRemoveIfMatched
      }

      const matched = findMatchingPatternToRemove(property.value, nodeToRemove, name, removedNodeSet)
      if (matched) {
        if (matched === property) {
          properties.splice(index, 1)
        }
        return matched
      }
    }
  } else if (node.type === 'AssignmentPattern') {
    const matched = findMatchingPatternToRemove(node.left, toRemoveIfMatched, name, removedNodeSet)
    if (matched) {
      return matched
    }
  }
}
