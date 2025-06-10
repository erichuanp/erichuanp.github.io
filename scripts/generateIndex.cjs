const fs = require('fs');
const path = require('path');

// 生成所有分类的索引文件
const categories = ['development_tools', 'frontend_development', 'backend_development', 'databases'];

categories.forEach(category => {
  const categoryDir = path.join(__dirname, '..', 'public', 'posts', category);
  
  // 检查目录是否存在
  if (!fs.existsSync(categoryDir)) {
    console.log(`Directory ${categoryDir} does not exist, skipping...`);
    return;
  }
  
  try {
    // 读取目录中的所有 .md 文件
    const files = fs.readdirSync(categoryDir)
      .filter(name => name.endsWith('.md'))
      .sort(); // 按字母顺序排序
    
    // 生成索引文件
    const indexPath = path.join(categoryDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(files, null, 2));
    
    console.log(`Generated index for ${category}: ${files.length} files`);
    console.log(`Files: ${files.join(', ')}`);
  } catch (error) {
    console.error(`Error generating index for ${category}:`, error);
  }
});

console.log('Index generation completed!');