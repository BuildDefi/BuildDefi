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

const expectEvents = async (promise, events) => {
  const receipt = await promise;
  assert.equal(receipt.logs.length, events.length, 'events not emitted as expected');

  events.forEach((event, index) => {
    assert.equal(receipt.logs[index].event, event.name, `event name ${event.name} doesn't match`);

    Object.keys(event.args).forEach(key => {
      assert.equal(
        numberToString(receipt.logs[index].args[key]),
        numberToString(event.args[key]),
        `events[${index}].args.${key} values doesn't match`
      );
    });
  });
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
  const pair = accounts[1];
  const developer = accounts[2];
  const holder = accounts[3];
  const liquidity = accounts[4];

  it('isPair should work', async () => {
    const instance = await BuildDefi.deployed();
    assert.equal(await instance.isPair(pair), false);
  });

  it('setIsPair should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setIsPair(pair, true);
    assert.equal(await instance.isPair(pair), true);
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

  it('getFeeDenominator should return (100)', async () => {
    const instance = await BuildDefi.deployed();
    assert.equal(await promiseToString(instance.getFeeDenominator()), numberToString(100));
  });

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

  it('getLiquidityFee should return (0, 0)', async () => {
    const instance = await BuildDefi.deployed();
    const res = await instance.getLiquidityFee();
    assert.equal(res.purchase.toString(), 0);
    assert.equal(res.sale.toString(), 0);
  });

  it('setFeeDenominator should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setFeeDenominator(1000);
    assert.equal(await promiseToString(instance.getFeeDenominator()), numberToString(1000));
    await instance.setFeeDenominator(100);
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

  it('setLiquidityFee should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setLiquidityFee(5, 3);
    const res = await instance.getLiquidityFee();
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

  it('getLiquidityAddress should work', async () => {
    const instance = await BuildDefi.deployed();
    assert.equal(await instance.getLiquidityAddress(), ZERO_ADDRESS);
  });

  it('setLiquidityAddress should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setLiquidityAddress(liquidity);
    assert.equal(await instance.getLiquidityAddress(), liquidity);
  });

  it('distribute should revert properly', async () => {
    const instance = await BuildDefi.deployed();
    // empty holder length
    await expectError(instance.distribute([], [], 0));
    // different holder and quota length
    await expectError(instance.distribute([accounts[2]], [], 0));
    // amount 0
    await expectError(instance.distribute([accounts[2]], [1], 0));
    // amount higher than balance
    await expectError(instance.distribute([accounts[2]], [1], 1, { from: accounts[2]}));
    // holder with a zero address
    await expectError(instance.distribute([accounts[2], ZERO_ADDRESS], [1, 2], 10));
  });

  it('distribute should work', async () => {
    const instance = await BuildDefi.deployed();
    const holders = [accounts[2], accounts[3], accounts[4], accounts[5]];

    await expectEvents(instance.distribute(holders, [1, 2, 2, 5], 1000), [
      { name: 'Transfer', args: { from: accounts[0], to: accounts[2], value: 100 } },
      { name: 'Transfer', args: { from: accounts[0], to: accounts[3], value: 200 } },
      { name: 'Transfer', args: { from: accounts[0], to: accounts[4], value: 200 } },
      { name: 'Transfer', args: { from: accounts[0], to: accounts[5], value: 500 } },
    ]);

    assert.equal(await promiseToString(instance.balanceOf(accounts[2])), numberToString(100));
    assert.equal(await promiseToString(instance.balanceOf(accounts[3])), numberToString(200));
    assert.equal(await promiseToString(instance.balanceOf(accounts[4])), numberToString(200));
    assert.equal(await promiseToString(instance.balanceOf(accounts[5])), numberToString(500));
  });
});
