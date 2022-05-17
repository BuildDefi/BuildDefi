// SPDX-License-Identifier: BuildDefi
pragma solidity ^0.8.2;

import './ERC20.sol';
import './Ownable.sol';

contract BuildDefi is ERC20Burnable, Ownable {

  address[] private _liquidityAddresses;
  uint256 private _purchaseLiquidityFee;
  uint256 private _saleLiquidityFee;

  constructor() ERC20("BuildDefi", "BDF") {
    _mint(msg.sender, 10000000000 * 10 ** decimals());
  }

  function decimals() public view virtual override returns (uint8) {
    return 18;
  }

  function getLiquidityAddresses() public view returns (address[] memory) {
    return _liquidityAddresses;
  }

  function setLiquidityAddresses(address[] calldata addresses) external onlyOwner() {
    for (uint i = 0; i < addresses.length; ++i) {
      require(addresses[i] != address(0), "BuildDefi: liquidity addresses contains a zero address");
    }

    _liquidityAddresses = addresses;
  }

  function getPurchaseLiquidityFee() public view returns (uint256) {
    return _purchaseLiquidityFee;
  }

  function setPurchaseLiquidityFee(uint256 newFee) external onlyOwner() {
    _purchaseLiquidityFee = newFee;
  }

  function getSaleLiquidityFee() public view returns (uint256) {
    return _saleLiquidityFee;
  }

  function setSaleLiquidityFee(uint256 newFee) external onlyOwner() {
    _saleLiquidityFee = newFee;
  }
}
