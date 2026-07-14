const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /#0D5C3A/gi, replace: '#E03B0D' },
  { search: /#07452A/gi, replace: '#A12808' },
  { search: /13,\s*92,\s*58/g, replace: '224, 59, 13' },
  { search: /#E6F4EA/gi, replace: '#FDECE8' },
  { search: /Premium Hostel/g, replace: 'XTRACITY HOSTELS AND APARTMENTS LTD' },
  { search: /Located just minutes from Academic City University, Agbogba/g, replace: 'Located at Cosway Down, Agbogba, Accra' },
  // Email update just in case
  { search: /xtracity2022@gmail\.com/g, replace: 'Xtracityhostels@gmail.com' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(tsx|ts|css|js|jsx)$/.test(fullPath)) {
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

processDirectory(path.join(__dirname, 'src'));
console.log('Replacement complete.');
