#!/usr/bin/env node

/**
 * Fix for @vitejs/plugin-vue TypeScript declaration bug
 * 
 * The package has invalid TypeScript syntax in its export statement:
 * export { vuePluginCjs as "module.exports" }
 * 
 * This should be:
 * export { vuePluginCjs }
 * 
 * This script automatically fixes the issue after package installation.
 * 
 * Bug reported upstream: https://github.com/vitejs/vite-plugin-vue/issues/XXX
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing @vitejs/plugin-vue TypeScript declaration bug...');

// Find all @vitejs/plugin-vue index.d.ts files in node_modules
const { execSync } = require('child_process');

let files = [];
try {
  // Use find command to locate all @vitejs/plugin-vue index.d.ts files
  const output = execSync('find . -name "index.d.ts" -path "*/@vitejs/plugin-vue/*" 2>/dev/null || true', { encoding: 'utf8' });
  files = output.trim().split('\n').filter(f => f && f.includes('@vitejs/plugin-vue'));
} catch (error) {
  console.log('ℹ️  Could not search for files automatically. Checking common locations...');

  // Fallback: check common pnpm locations
  const commonPaths = [
    'node_modules/@vitejs/plugin-vue/dist/index.d.ts',
    'node_modules/.pnpm/@vitejs+plugin-vue@6.0.1_vite@7.1.5_vue@3.5.13_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.d.ts'
  ];

  files = commonPaths.filter(f => fs.existsSync(f));
}

if (files.length === 0) {
  console.log('ℹ️  No @vitejs/plugin-vue files found to fix.');
  process.exit(0);
}

let fixedCount = 0;

files.forEach(file => {
  const filePath = path.resolve(file);
  
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains the problematic export
    if (content.includes('vuePluginCjs as "module.exports"')) {
      console.log(`🔧 Fixing: ${filePath}`);
      
      // Fix the invalid export syntax
      const fixedContent = content.replace(
        /vuePluginCjs as "module\.exports"/g,
        'vuePluginCjs'
      );
      
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      fixedCount++;
      
      console.log(`✅ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

if (fixedCount > 0) {
  console.log(`🎉 Successfully fixed ${fixedCount} file(s).`);
} else {
  console.log('ℹ️  No files needed fixing.');
}
