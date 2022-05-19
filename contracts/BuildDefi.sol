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

  struct Fee {
    uint256 purchase;
    uint256 sale;
  }

  Fee private _liquidityFee;

  mapping (address => bool) private _isPool;

  IUniswapV2Router02 public immutable uniswapV2Router;
  address public immutable uniswapV2Pair;

  constructor(address router) ERC20("BuildDefi", "BDF") {
    // 0x10ED43C718714eb63d5aA57B78B54704E256024E Pancake Router v2
    // 0xD99D1c33F9fC3444f8101754aBC46c52416550D1 Pancake Router v2 Testnet
    IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(router);
    // Create a uniswap pair (BDF/BNB) for this new token
    uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
        .createPair(address(this), _uniswapV2Router.WETH());

    uniswapV2Router = _uniswapV2Router;

    _isPool[uniswapV2Pair] = true;

    _mint(msg.sender, 10000000000 * 10 ** decimals());
  }

  function decimals() public view virtual override returns (uint8) {
    return 18;
  }

  function getLiquidityFee() public view returns (uint256 purchaseFee, uint256 saleFee) {
    return (_liquidityFee.purchase, _liquidityFee.sale);
  }

  function setLiquidityFee(uint256 purchaseFee, uint256 saleFee) external onlyOwner() {
    _liquidityFee.purchase = purchaseFee;
    _liquidityFee.sale = saleFee;
  }

  function isExcludedFromFee(address account) public view returns(bool) {
    return _isPool[account];
  }

  function changeIsExcludedFromFee(address account, bool status) external onlyOwner() {
    _isPool[account] = status;
  }
}
