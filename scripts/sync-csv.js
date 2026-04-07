// Copy latest collected.csv from the scraper directory into the repo
// so Vercel builds pick up the newest scraped companies.
const fs = require('fs');
const path = require('path');

const SRC = 'C:/GitProject/スクレイパー製作/collected.csv';
const DEST = path.resolve(__dirname, '../prisma/collected.csv');

if (!fs.existsSync(SRC)) {
  console.error(`Source not found: ${SRC}`);
  process.exit(1);
}

fs.copyFileSync(SRC, DEST);
const stat = fs.statSync(DEST);
console.log(`Copied ${SRC}\n     -> ${DEST}`);
console.log(`Size: ${(stat.size / 1024).toFixed(1)} KB`);
