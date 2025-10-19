import fs from "fs";
import path from "path";

// === 配置区 ===
const githubUser = "hypocritical-jiang"; // GitHub 用户名
const repoName = "blog-assets"; // 仓库名
const branch = "main"; // 分支
const assetDir = "./"; // 本地资源目录（图片/视频）
const outputFile = "cdn_links.md"; // 输出文件名

// 支持的文件类型
const IMAGE_EXT = /\.(png|jpe?g|gif|svg|webp)$/i;
const VIDEO_EXT = /\.(mp4|webm|ogg)$/i;

// === 工具函数 ===
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

function generateCDNLink(localPath) {
  const relativePath = localPath.replace(assetDir + "/", "").replace(/\\/g, "/");
  return `https://cdn.jsdelivr.net/gh/${githubUser}/${repoName}@${branch}/${relativePath}`;
}

// === 主逻辑 ===
const allFiles = getAllFiles(assetDir);
const imageFiles = allFiles.filter(f => IMAGE_EXT.test(f));
const videoFiles = allFiles.filter(f => VIDEO_EXT.test(f));

let output = `# 🌐 jsDelivr CDN 资源索引  
> 自动生成时间：${new Date().toLocaleString()}  
> 仓库：\`${githubUser}/${repoName}@${branch}\`  

---

`;

if (imageFiles.length) {
  output += `## 🖼 图片资源 (${imageFiles.length} 个)\n\n`;
  imageFiles.forEach(file => {
    const cdnLink = generateCDNLink(file);
    const fileName = path.basename(file);
    output += `### ${fileName}\n`;
    output += `**链接：** [${cdnLink}](${cdnLink})  \n`;
    output += `**预览：**  \n`;
    output += `![${fileName}](${cdnLink})\n\n`;
  });
}

if (videoFiles.length) {
  output += `## 🎬 视频资源 (${videoFiles.length} 个)\n\n`;
  videoFiles.forEach(file => {
    const cdnLink = generateCDNLink(file);
    const fileName = path.basename(file);
    output += `### ${fileName}\n`;
    output += `**链接：** [${cdnLink}](${cdnLink})  \n`;
    output += `**预览：**  \n`;
    output += `<video src="${cdnLink}" width="480" height="270" controls muted preload="metadata"></video>\n\n`;
  });
}

fs.writeFileSync(outputFile, output, "utf-8");
console.log(`✅ 已生成 ${outputFile}，共包含 ${imageFiles.length} 张图片、${videoFiles.length} 个视频`);
