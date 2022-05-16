const BuildDefi = artifacts.require("BuildDefi");

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract("BuildDefi", accounts => {
  const owner = accounts[0];

  it('liquidityAddress should return zero address', async () => {
    const instance = await BuildDefi.deployed();
    const res = await instance.getLiquidityAddresses();
    assert.equal(res.length, 0);
  });
});
