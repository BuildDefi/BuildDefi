const fs = require('fs');

const admin_holders = [
  '0x66Fd560B1EDBef38E0F45B58E858C49B42c368cB', // BDF Partner
  '0x6d8d1D0B68651Da8d920f4662B8C3537e90EFedf', // BDF Privada - Swap
  '0xf22b140aFFb898113F95c6B775bb87A1dCDFe819', // BDF Desenvolvedores/Developer
  '0x4CaA4cA82839B4936595A73C15Cd7c6D59890625', // BDF Doação/Donation
  '0x54Dbba94d215c8e9e5b7fBb9FDff1e141EFeA661', // BDF Negócios/Enterprise
  '0x5592eC8B6Af077f979c8517519bD4F8C35CC8a01', // BDF Marketing
  '0x2fa8927cc744bd061401a4D2F297246771505E37', // BDF Principal Public New
  '0x358A047853efC0D6F35464C0f6Da9aee5780eF89', // BDF Queima/Burning
  '0x7533e664140435beacc6eef442da61f0d1c89dd5' // ?
].map(h => h.toLowerCase());

const all_holders_file = fs.readFileSync('./all_holders.txt', 'utf8');
const all_holders_over_40 = all_holders_file.split('\n').map(line => {
  if (line) {
    const cols = line.split('\t');
    const value = cols[2].replace(/,/g, '');
    return { address: cols[1].trim(), value };
  }

  return line;
}).filter(holder => {
  return holder && holder.address.startsWith('0x') &&
  !admin_holders.includes(holder.address) && holder.value > 40000;
});

const private_holders_file = fs.readFileSync('./private_holders.txt', 'utf8');
const private_holders_map = {};
private_holders_file.replace(/\r/g, '').split('\n').forEach(holder => {
  const tokens = holder.split(';');
  private_holders_map[tokens[0].toLowerCase()] = +tokens[2];
});

const private_holders_over_40_quote = all_holders_over_40.filter(holder => {
  return private_holders_map[holder.address];
}).map(holder => {
  return { ...holder, quote: private_holders_map[holder.address.toLowerCase()], private: true };
});

const public_holders_over_100 = all_holders_over_40.filter(holder => {
  return !private_holders_map[holder.address.toLowerCase()] && holder.value > 100000;
});

const public_holders_over_100_quote = public_holders_over_100.map(holder => {
  return { ...holder, quote: Math.floor(holder.value / 100000)}
});

const all_holders_quote = public_holders_over_100_quote.concat(private_holders_over_40_quote);

// const total = 1000;
const total = 2194426;

let totalQuote = 0;
all_holders_quote.forEach(holder => {
  totalQuote += holder.quote;
});

const quoteValue = total / totalQuote;

const all_holders_quote_divided = all_holders_quote.map(holder => {
  return { ...holder, divided: quoteValue * holder.quote };
});

all_holders_quote_divided.forEach(holder => {
  console.log(`${holder.private ? 'privado' : 'publico'}: ${holder.address} -> ${holder.quote} -> ${holder.divided}`);
});

