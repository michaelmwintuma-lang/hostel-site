const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /bookings@xtracity\.com\.gh/gi, replace: 'Xtracityhostels@gmail.com' },
  { search: /xtracity2022@gmail\.com/gi, replace: 'Xtracityhostels@gmail.com' },
  { search: /michaeldmwintuma@gmail\.com/gi, replace: 'Xtracityhostels@gmail.com' },
  { search: /michael\.mwintuma@acity\.edu\.gh/gi, replace: 'Xtracityhostels@gmail.com' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Avoid node_modules and .next
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        processDirectory(fullPath);
      }
    } else if (/\.(tsx|ts|css|js|jsx|env|env\.local)$/.test(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      for (const { search, replace } of replacements) {
        if (search.test(content)) {
          content = content.replace(search, replace);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname));
console.log('Replacement complete.');
