const fs = require('fs');

const logHolders = holders => {
  holders.forEach(holder => {
    console.log(`${holder.address} -> ${holder.value}`)
  });
};

const all_holders_file = fs.readFileSync('./all_holders.txt', 'utf8');
const all_holders_over_40 = all_holders_file.split('\n').map(line => {
  if (line) {
    const cols = line.split('\t');
    const value = cols[2].replace(/,/g, '');
    return { address: cols[1].trim(), value };
  }

  return line;
}).filter(holder => {
  return holder && holder.address.startsWith('0x') && holder.value > 40000;
});

const private_holders_file = fs.readFileSync('./private_holders.txt', 'utf8');
const private_holders_map = {};
private_holders_file.replace(/\r/g, '').split('\n').forEach(holder => {
  private_holders_map[holder] = holder;
});

const private_holders_over_40 = all_holders_over_40.filter(holder => {
  return private_holders_map[holder.address];
});

const public_holders_over_100 = all_holders_over_40.filter(holder => {
  return !private_holders_map[holder.address] && holder.value > 100000;
})

// logHolders(all_holders_over_40);
// logHolders(private_holders_over_40);
// console.log(all_holders_over_40.length, private_holders_over_40)
logHolders(public_holders_over_100);
