pragma solidity ^0.8.2;

import './ERC20.sol';

contract BuildDefi is ERC20, ERC20Burnable {
  constructor() ERC20("BuildDefi", "BDF") {
    _mint(msg.sender, 10000000000 * 10 ** decimals());
  }

  function decimals() public view virtual override returns (uint8) {
    return 9;
  }
}
