import fs from 'fs';
const cards = JSON.parse(fs.readFileSync('/home/ubuntu/cards-needing-images.json', 'utf8'));
const progress = JSON.parse(fs.readFileSync('/home/ubuntu/image-gen-progress.json', 'utf8'));
const doneIds = new Set(progress.completed.map(c => c.id));
const remaining = cards.filter(c => {
  return doneIds.has(c.id) === false;
});
const batchSize = parseInt(process.argv[2] || '5');
console.log('Remaining:', remaining.length);
remaining.slice(0, batchSize).forEach(c => {
  console.log(JSON.stringify({id: c.id, num: c.cardNumber, char: c.characterName, set: c.setName, type: c.cardType}));
});
