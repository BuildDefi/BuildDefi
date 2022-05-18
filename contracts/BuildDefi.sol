// SPDX-License-Identifier: BuildDefi
pragma solidity ^0.8.2;

import './Ownable.sol';
import './ERC20Burnable.sol';
import './libraries/SafeMath.sol';
import './libraries/Address.sol';
import './interfaces/UniswapV2.sol';

contract BuildDefi is ERC20Burnable, Ownable {

  using SafeMath for uint256;
  using Address for address;

  address[] private _liquidityAddresses;
  uint256 private _purchaseLiquidityFee;
  uint256 private _saleLiquidityFee;

  IUniswapV2Router02 public immutable uniswapV2Router;
  address public immutable uniswapV2Pair;

  constructor() ERC20("BuildDefi", "BDF") {
    _mint(msg.sender, 10000000000 * 10 ** decimals());
    IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0x10ED43C718714eb63d5aA57B78B54704E256024E);
    // 0xD99D1c33F9fC3444f8101754aBC46c52416550D1 testnet
    // 0x10ED43C718714eb63d5aA57B78B54704E256024E bsc pancake router v2
    // Create a uniswap pair for this new token
    uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
        .createPair(address(this), _uniswapV2Router.WETH());

    // set the rest of the contract variables
    uniswapV2Router = _uniswapV2Router;
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
