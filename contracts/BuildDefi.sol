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
  Fee private _liquidityFee;

  uint256 private _feeDenominator;

  address _holderAddress;
  address _developerAddress;
  address _liquidityAddress;

  mapping (address => bool) private _isPair;
  mapping (address => bool) private _isExcludedFromFee;

  uint256 private _holdLimit;

  constructor() ERC20("BuildDefi", "BDF") {
    _mint(msg.sender, 10000000000 * 10 ** decimals());
    _isExcludedFromFee[owner()] = true;
    _feeDenominator = 100;
  }

  function decimals() public view virtual override returns (uint8) {
    return 9;
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

  function getLiquidityFee() public view returns (uint256 purchase, uint256 sale) {
    return (_liquidityFee.purchase, _liquidityFee.sale);
  }

  function setLiquidityFee(uint256 purchase, uint256 sale) external onlyOwner() {
    _liquidityFee.purchase = purchase;
    _liquidityFee.sale = sale;
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

  function getLiquidityAddress() public view returns (address liquidityAddress) {
    return _liquidityAddress;
  }

  function setLiquidityAddress(address liquidityAddress) external onlyOwner() {
    _liquidityAddress = liquidityAddress;
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

  function getHoldLimit() public view returns (uint256 holdLimit) {
    return _holdLimit;
  }

  function setHoldLimit(uint256 holdLimit) external onlyOwner() {
    _holdLimit = holdLimit;
  }

  function _transfer(
    address sender,
    address recipient,
    uint256 amount
  ) internal virtual override {
    require(sender != address(0), "BuildDefi: transfer from the zero address");
    require(recipient != address(0), "BuildDefi: transfer to the zero address");

    uint256 senderBalance = _balances[sender];
    require(senderBalance >= amount, "BuildDefi: transfer amount exceeds balance");
    unchecked {
      _balances[sender] = senderBalance.sub(amount);
    }

    uint256 transferAmount = amount;

    if (!_isExcludedFromFee[sender] && !_isExcludedFromFee[recipient]) {
      uint256 burnFee;
      uint256 holderFee;
      uint256 developerFee;
      uint256 liquidityFee;

      if (_isPair[sender] && !_isPair[recipient]) {
        uint256 supplyLimit = _totalSupply.mul(_holdLimit).div(1000);
        require(_balances[recipient].add(transferAmount) < supplyLimit, "BuildDefi: transfer amount exceeds holdLimit");

        burnFee = calculateFee(amount, _burnFee.purchase);
        holderFee = calculateFee(amount, _holderFee.purchase);
        developerFee = calculateFee(amount, _developerFee.purchase);
        liquidityFee = calculateFee(amount, _liquidityFee.purchase);
      } else if (_isPair[recipient] && !_isPair[sender]) {
        burnFee = calculateFee(amount, _burnFee.sale);
        holderFee = calculateFee(amount, _holderFee.sale);
        developerFee = calculateFee(amount, _developerFee.sale);
        liquidityFee = calculateFee(amount, _liquidityFee.sale);
      }

      if (burnFee > 0) {
        transferAmount = transferAmount.sub(burnFee);
        _totalSupply -= burnFee;

        emit Transfer(sender, address(0), burnFee);
      }

      if (_holderAddress != address(0) && holderFee > 0) {
        transferAmount = transferAmount.sub(holderFee);
        _balances[_holderAddress] = _balances[_holderAddress].add(holderFee);

        emit Transfer(sender, _holderAddress, holderFee);
      }

      if (_developerAddress != address(0) && developerFee > 0) {
        transferAmount = transferAmount.sub(developerFee);
        _balances[_developerAddress] = _balances[_developerAddress].add(developerFee);

        emit Transfer(sender, _developerAddress, developerFee);
      }

      if (_liquidityAddress != address(0) && liquidityFee > 0) {
        transferAmount = transferAmount.sub(liquidityFee);
        _balances[_liquidityAddress] = _balances[_liquidityAddress].add(liquidityFee);

        emit Transfer(sender, _liquidityAddress, liquidityFee);
      }
    }

    _balances[recipient] = _balances[recipient].add(transferAmount);

    emit Transfer(sender, recipient, transferAmount);
  }

  function calculateFee(uint256 amount, uint256 fee) private view returns (uint256) {
    return amount.mul(fee).div(_feeDenominator);
  }

  function distribute(address[] calldata holders, uint256[] calldata quotas, uint256 amount) external {
    require(
      holders.length > 0 && holders.length == quotas.length,
      "BuildDefi: holders and quotas cannot be empty and must have the same length."
    );
    require(
      amount > 0 && _balances[_msgSender()] >= amount,
      "BuildDefi: amount cannot be zeros or higher than your balance."
    );

    bool containsZeroAddress;
    uint256 totalQuota = 0;

    for (uint256 i = 0; i < holders.length; ++i) {
      if (holders[i] == address(0)) {
        containsZeroAddress = true;
      }

      totalQuota = totalQuota.add(quotas[i]);
    }

    require(!containsZeroAddress, "BuildDefi: cannot distribute to the zero address");

    uint256 amountPerQuota = amount.div(totalQuota);

    for (uint256 i = 0; i < holders.length; ++i) {
      uint256 transferAmount = amountPerQuota.mul(quotas[i]);
      _balances[_msgSender()] = _balances[_msgSender()].sub(transferAmount);
      _balances[holders[i]] = _balances[holders[i]].add(transferAmount);

      emit Transfer(_msgSender(), holders[i], transferAmount);
    }
  }
}
