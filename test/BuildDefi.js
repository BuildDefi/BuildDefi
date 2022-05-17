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

const toNumber = async promise => {
  const result = await promise;
  return result.toNumber();
}

contract("BuildDefi", accounts => {
  const owner = accounts[0];

  describe('fees', () => {
    it('getLiquidityAddresses should return empty array', async () => {
      const instance = await BuildDefi.deployed();
      const res = await instance.getLiquidityAddresses();
      assert.equal(res.length, 0);
    });

    it('setLiquidityAddresses should revert when caller is not the owner', async () => {
      const instance = await BuildDefi.deployed();
      await expectError(instance.setLiquidityAddresses([], { from: accounts[1] }));
    });

    it('setLiquidityAddresses should revert when addresses contains a ZERO_ADDRESS', async () => {
      const instance = await BuildDefi.deployed();
      const addresses = [accounts[1], ZERO_ADDRESS, accounts[2]]
      await expectError(instance.setLiquidityAddresses(addresses));
    });

    it('setLiquidityAddresses should work properly', async () => {
      const instance = await BuildDefi.deployed();
      const addresses = [accounts[1], accounts[2]]
      await instance.setLiquidityAddresses(addresses);
      assert.deepEqual(await instance.getLiquidityAddresses(), addresses);
    });

    it('getLiquidityFee should return 0', async () => {
      const instance = await BuildDefi.deployed();
      assert.equal(await toNumber(instance.getLiquidityFee()), 0);
    });

    it('setLiquidityFee should revert when caller is not the owner', async () => {
      const instance = await BuildDefi.deployed();
      await expectError(instance.setLiquidityFee(3, { from: accounts[1] }));
    });

    it('setLiquidityFee should work properly', async () => {
      const instance = await BuildDefi.deployed();
      await instance.setLiquidityFee(3);
      assert.equal(await toNumber(instance.getLiquidityFee()), 3);
    });
  });
});
