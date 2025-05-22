const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    // 출력 디렉토리가 없으면 생성
    await fs.mkdir(outputDir, { recursive: true });

    // 각 크기별로 아이콘 생성
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      await sharp(inputFile)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`Generated ${size}x${size} icon`);
    }

    // favicon.ico 생성 (16x16)
    await sharp(inputFile)
      .resize(16, 16)
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('Generated favicon.ico');
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 