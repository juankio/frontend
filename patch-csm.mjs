import fs from 'node:fs';
import path from 'node:path';

function patchCjsModule(modulePath, exportName) {
  const fullPath = path.resolve(process.cwd(), 'node_modules', modulePath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  const patchString = `\nmodule.exports.default = ${exportName};\n`;
  
  if (!content.includes('module.exports.default')) {
    content += patchString;
    fs.writeFileSync(fullPath, content);
    console.log(`[Patch] Patched ${modulePath} to support default export.`);
  }
}

// Patch glsl-token-string
patchCjsModule('glsl-token-string/index.js', 'toString');

// Patch glsl-token-functions
patchCjsModule('glsl-token-functions/index.js', 'functions');

console.log('[Patch] CSM Dependencies patched successfully.');
