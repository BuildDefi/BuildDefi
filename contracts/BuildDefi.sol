// SPDX-License-Identifier: BuildDefi
pragma solidity ^0.8.2;

import './ERC20.sol';
import './Ownable.sol';

contract BuildDefi is ERC20Burnable, Ownable {

  address[] private _liquidityAddresses;

  constructor() ERC20("BuildDefi", "BDF") {
    _mint(msg.sender, 10000000000 * 10 ** decimals());
  }

  function decimals() public view virtual override returns (uint8) {
    return 9;
  }

  function getLiquidityAddresses() public view returns (address[] memory) {
    return _liquidityAddresses;
  }

  // function setLiquidityAddress(address[] calldata addresses) external onlyOwner() {
  //   _liquidityAddresses = addresses;
  // }
}
