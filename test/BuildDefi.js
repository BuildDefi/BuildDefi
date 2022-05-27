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
  const other = accounts[6];

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

  it('getOtherFee should return (0, 0)', async () => {
    const instance = await BuildDefi.deployed();
    const res = await instance.getOtherFee();
    assert.equal(res.purchase.toNumber(), 0);
    assert.equal(res.sale.toNumber(), 0);
  });

  it('getHoldLimit should return (0)', async () => {
    const instance = await BuildDefi.deployed();
    assert.equal(await promiseToString(instance.getHoldLimit()), numberToString(0));
  });

  it('setFeeDenominator should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setFeeDenominator(1000);
    assert.equal(await promiseToString(instance.getFeeDenominator()), numberToString(1000));
    await instance.setFeeDenominator(100);
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

  it('setOtherFee should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setOtherFee(3, 2);
    const res = await instance.getOtherFee();
    assert.equal(res.purchase.toNumber(), 3);
    assert.equal(res.sale.toNumber(), 2);
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

  it('getOtherAddress should work', async () => {
    const instance = await BuildDefi.deployed();
    assert.equal(await instance.getOtherAddress(), ZERO_ADDRESS);
  });

  it('setOtherAddress should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setOtherAddress(other);
    assert.equal(await instance.getOtherAddress(), other);
  });

  it('setHoldLimit should work', async () => {
    const instance = await BuildDefi.deployed();
    await instance.setHoldLimit(10);
    assert.equal(await promiseToString(instance.getHoldLimit()), numberToString(10));
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

  it('transfer from pair should revert when amount of recipient exceeds holdLimit', async () => {
    const instance = await BuildDefi.deployed();
    // 10,000,000,000.000000000 supply
    //    100,000,000.000000000 holderLimit of 10 = 1% of supply
    //     10,000,000.000000000 holderLimit of  1 = 0.1% of supply
    await instance.transfer(pair, '1000000000000000000', { from: owner });
    await instance.setHoldLimit(1);
    // transfer exceeds 0.1% of supply
    await expectError(instance.transfer(accounts[5], '10000000000000000', { from: pair }));
    await instance.setHoldLimit(10);
    assert.equal(await promiseToString(instance.balanceOf(accounts[5])), '500');
    await instance.transfer(accounts[5], '90000000000000000', { from: pair });
    assert.equal(await promiseToString(instance.balanceOf(accounts[5])), '78300000000000500');
    // transfer exceeds 1% of supply
    await expectError(instance.transfer(accounts[5], '21699999999999500', { from: pair }));
    // should not revert when sender is not a pair
    await instance.transfer(accounts[5], '21699999999999500', { from: owner });
  });
});
