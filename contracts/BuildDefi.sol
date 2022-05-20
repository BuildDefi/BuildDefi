// SPDX-License-Identifier: BuildDefi
pragma solidity ^0.8.2;

import './Ownable.sol';
import './ERC20Burnable.sol';
import './libraries/SafeMath.sol';
import './libraries/Address.sol';

contract BuildDefi is ERC20Burnable, Ownable {

  using SafeMath for uint256;
  using Address for address;

  struct Fee {
    uint256 purchase;
    uint256 sale;
  }

  Fee private _burnFee;
  Fee private _holderFee;
  Fee private _developerFee;
  uint256 private _feeDenominator;

  address _holderAddress;
  address _developerAddress;

  mapping (address => bool) private _isPair;
  mapping (address => bool) private _isExcludedFromFee;

  constructor() ERC20("BuildDefi", "BDF") {
    _mint(msg.sender, 10000000000 * 10 ** decimals());
    _isExcludedFromFee[owner()] = true;
    _feeDenominator = 100;
  }

  function getFeeDenominator() public view returns (uint256 feeDenominator) {
    return _feeDenominator;
  }

  function setFeeDenominator(uint256 feeDenominator) external onlyOwner() {
    _feeDenominator = feeDenominator;
  }

  function getBurnFee() public view returns (uint256 purchase, uint256 sale) {
    return (_burnFee.purchase, _burnFee.sale);
  }

  function setBurnFee(uint256 purchase, uint256 sale) external onlyOwner() {
    _burnFee.purchase = purchase;
    _burnFee.sale = sale;
  }

  function getHolderFee() public view returns (uint256 purchase, uint256 sale) {
    return (_holderFee.purchase, _holderFee.sale);
  }

  function setHolderFee(uint256 purchase, uint256 sale) external onlyOwner() {
    _holderFee.purchase = purchase;
    _holderFee.sale = sale;
  }

  function getDeveloperFee() public view returns (uint256 purchase, uint256 sale) {
    return (_developerFee.purchase, _developerFee.sale);
  }

  function setDeveloperFee(uint256 purchase, uint256 sale) external onlyOwner() {
    _developerFee.purchase = purchase;
    _developerFee.sale = sale;
  }

  function getHolderAddress() public view returns (address holderAddress) {
    return _holderAddress;
  }

  function setHolderAddress(address holder) external onlyOwner() {
    _holderAddress = holder;
  }

  function getDeveloperAddress() public view returns (address developerAddress) {
    return _developerAddress;
  }

  function setDeveloperAddress(address developerAddress) external onlyOwner() {
    _developerAddress = developerAddress;
  }

  function isPair(address account) public view returns (bool) {
    return _isPair[account];
  }

  function setIsPair(address account, bool status) external onlyOwner() {
    _isPair[account] = status;
  }

  function isExcludedFromFee(address account) public view returns (bool) {
    return _isExcludedFromFee[account];
  }

  function setIsExcludedFromFee(address account, bool status) external onlyOwner() {
    _isExcludedFromFee[account] = status;
  }

  function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual override {
    if (!_isExcludedFromFee[from] && !_isExcludedFromFee[to]) {
      if (_isPair[from] && !_isPair[to]) {
        uint256 burnFee = calculateFee(amount, _burnFee.purchase);
        uint256 holderFee = calculateFee(amount, _holderFee.purchase);
        uint256 developerFee = calculateFee(amount, _developerFee.purchase);

        deductFeesFromAccount(to, burnFee, holderFee, developerFee);
      } else if (_isPair[to] && !_isPair[from]) {
        uint256 burnFee = calculateFee(amount, _burnFee.sale);
        uint256 holderFee = calculateFee(amount, _holderFee.sale);
        uint256 developerFee = calculateFee(amount, _developerFee.sale);

        deductFeesFromAccount(to, burnFee, holderFee, developerFee);
      }
    }
  }

  function calculateFee(uint256 amount, uint256 fee) private view returns (uint256) {
    return amount.mul(fee).div(_feeDenominator);
  }

  function deductFeesFromAccount(address account, uint256 burnFee, uint256 holderFee, uint256 developerFee) private {
    if (burnFee > 0) {
      _balances[account] = _balances[account].sub(burnFee);
      _totalSupply -= burnFee;
      emit Transfer(account, address(0), burnFee);
    }

    if (_holderAddress != address(0) && holderFee > 0) {
      _balances[account] = _balances[account].sub(holderFee);
      _balances[_holderAddress] = _balances[_holderAddress].add(holderFee);
      emit Transfer(account, _holderAddress, holderFee);
    }

    if (_developerAddress != address(0) && developerFee > 0) {
      _balances[account] = _balances[account].sub(developerFee);
      _balances[_developerAddress] = _balances[_developerAddress].add(developerFee);
      emit Transfer(account, _developerAddress, developerFee);
    }
  }
}
