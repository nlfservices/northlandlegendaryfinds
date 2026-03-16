import fs from 'fs';
const cards = JSON.parse(fs.readFileSync('/home/ubuntu/cards-needing-images.json', 'utf8'));
const bySet = {};
cards.forEach(c => {
  const key = c.setName;
  if (bySet[key] === undefined) bySet[key] = 0;
  bySet[key] = bySet[key] + 1;
});
Object.entries(bySet).forEach(([name, count]) => console.log(name + ': ' + count));
console.log('Total: ' + cards.length);

// Show first 5 from each set
console.log('\n--- Sample from each set ---');
const seen = {};
cards.forEach(c => {
  if (seen[c.setName] === undefined) seen[c.setName] = 0;
  if (seen[c.setName] < 3) {
    console.log(c.id, c.setName, c.cardNumber, c.characterName, c.cardType);
    seen[c.setName] = seen[c.setName] + 1;
  }
});
