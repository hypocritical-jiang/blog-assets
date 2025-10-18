// gen-jsdelivr-links.mjs
import fs from 'fs';
import path from 'path';

// === 1. 修改这里 ===
const githubUser = 'hypocritical-jiang';     // ← 你的 GitHub 用户名
const repoName = 'blog-assets';    // ← 仓库名
const branch = 'main';             // ← 默认 main 分支
const imageDir = './images';       // ← 本地图片文件夹路径

// === 2. 自动扫描文件 ===
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

// === 3. 生成 jsDelivr 链接 ===
function generateCDNLink(localPath) {
  const relativePath = localPath.replace(imageDir + '/', '').replace(/\\/g, '/');
  return `https://cdn.jsdelivr.net/gh/${githubUser}/${repoName}@${branch}/${relativePath}`;
}

// === 4. 主程序 ===
const allFiles = getAllFiles(imageDir).filter(f => /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f));

let output = `# jsDelivr Links (${new Date().toLocaleString()})\n\n`;

allFiles.forEach(file => {
  const cdnLink = generateCDNLink(file);
  output += `- \`${file}\`\n  → ${cdnLink}\n\n`;
});

console.log(output);
fs.writeFileSync('cdn_links.md', output, 'utf-8');
console.log('\n✅ 已生成 cdn_links.md 文件');
