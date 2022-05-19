const BuildDefi = artifacts.require("BuildDefi");

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const expectError = async promise => {
  try {
    await promise;
    assert(false, 'The expected error did not occur.');
  } catch (error) {
    assert(error.message.includes('revert'));
  }
};

const promiseToString = async promise => {
  const result = await promise;
  return result.toString();
};

const numberToString = number => {
  return number.toLocaleString().replace(/,/g, '');
};

contract("BuildDefi", accounts => {
  const owner = accounts[0];
  const pool = accounts[1];
  const developer = accounts[2];
  const holder = accounts[3];
  const bob = accounts[4];
  const decimals = 10 ** 18;

  it('isPool should work', async () => {
    const instance = await BuildDefi.deployed();
    assert.equal(await instance.isPool(pool), false);
  });

  it('setIsPool should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setIsPool(pool, true);
    assert.equal(await instance.isPool(pool), true);
  });

  it('isExcludedFromFee should work', async () => {
    const instance = await BuildDefi.deployed();
    assert.equal(await instance.isExcludedFromFee(owner), true);
    assert.equal(await instance.isExcludedFromFee(developer), false);
  });

  it('setIsExcludedFromFee should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setIsExcludedFromFee(developer, true);
    assert.equal(await instance.isExcludedFromFee(developer), true);
  });

  it('transfer should work', async () => {
    const instance = await BuildDefi.deployed();
    const amount = numberToString(10000 * decimals);
    await instance.transfer(pool, numberToString(amount));
    assert.equal(await promiseToString(instance.balanceOf(pool)), amount);
    // assert.equal(await promiseToString(instance.balanceOf(owner)), totalSupply - amount);
    // console.log(`balance of owner ${await promiseToString(instance.balanceOf(owner))}`);
  })

  it('getBurnFee should return (0, 0)', async () => {
    const instance = await BuildDefi.deployed();
    const res = await instance.getBurnFee();
    assert.equal(res.purchase.toNumber(), 0);
    assert.equal(res.sale.toNumber(), 0);
  });

  it('getHolderFee should return (0, 0)', async () => {
    const instance = await BuildDefi.deployed();
    const res = await instance.getHolderFee();
    assert.equal(res.purchase.toNumber(), 0);
    assert.equal(res.sale.toNumber(), 0);
  });

  it('getDeveloperFee should return (0, 0)', async () => {
    const instance = await BuildDefi.deployed();
    const res = await instance.getDeveloperFee();
    assert.equal(res.purchase.toString(), 0);
    assert.equal(res.sale.toString(), 0);
  });

  it('setBurnFee should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setBurnFee(3, 2);
    const res = await instance.getBurnFee();
    assert.equal(res.purchase.toNumber(), 3);
    assert.equal(res.sale.toNumber(), 2);
  });

  it('setHolderFee should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setHolderFee(0, 5);
    const res = await instance.getHolderFee();
    assert.equal(res.purchase.toNumber(), 0);
    assert.equal(res.sale.toNumber(), 5);
  });

  it('setDeveloperFee should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setDeveloperFee(5, 3);
    const res = await instance.getDeveloperFee();
    assert.equal(res.purchase.toNumber(), 5);
    assert.equal(res.sale.toNumber(), 3);
  });

  it('getHolderAddress should work', async () => {
    const instance = await BuildDefi.deployed();
    assert.equal(await instance.getHolderAddress(), ZERO_ADDRESS);
  });

  it('setHolderAddress should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setHolderAddress(holder);
    assert.equal(await instance.getHolderAddress(), holder);
  });

  it('getDeveloperAddress should work', async () => {
    const instance = await BuildDefi.deployed();
    assert.equal(await instance.getDeveloperAddress(), ZERO_ADDRESS);
  });

  it('setDeveloperAddress should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setDeveloperAddress(developer);
    assert.equal(await instance.getDeveloperAddress(), developer);
  });
});
