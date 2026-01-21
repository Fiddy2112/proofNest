// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ProofNest is Ownable,Pausable {

  struct Plan {
      string name;
      uint256 monthlyPrice;
      uint256 annualDiscount;
      bool isActive;
  }

  struct Subscription {
    uint256 planId;
    uint256 expiresAt;
  }

  struct Proof {
    address owner;
    uint256 timestamp;
  }

  event PlanPurchased(
      address indexed user,
      uint256 planId,
      string planName,
      bool isAnnual,
      uint256 amount,
      uint256 expiresAt
  );

  event PlanUpdated(
      uint256 planId,
      string name,
      uint256 monthlyPrice,
      uint256 annualDiscount,
      bool isActive
  );

  event ProofCreated(
    address indexed user,
    bytes32 indexed contentHash,
    uint256 timestamp
  );

  event Withdrawal(
    uint256 amount,
    uint256 timestamp
  );

  mapping(uint256 => Plan) public plans;

  mapping(address => Subscription) public subscriptions;

  mapping(bytes32 => Proof) public proofs;

  constructor() Ownable(msg.sender) {
    plans[1] = Plan({
      name: "Pro",
      monthlyPrice: 0.01 ether,
      annualDiscount: 20,
      isActive: true
    });

    plans[2] = Plan({
      name: "Team",
      monthlyPrice: 0.05 ether,
      annualDiscount: 30,
            isActive: true
    });
  }

  function getPrice (uint256 planId, bool isAnnual) public view returns (uint256) {
    Plan memory p = plans[planId];

    require(p.isActive, "Plan inactive");

    if(isAnnual){
      return (p.monthlyPrice * 12 * (100 - p.annualDiscount)) / 100 ;
    }

    return p.monthlyPrice;
  }

  function hasActiveSubscription(address user)public view returns(bool){
    return subscriptions[user].expiresAt >= block.timestamp;
  }

  function subscribe(uint256 planId, bool isAnnual) external payable whenNotPaused{
    uint256 price = getPrice(planId, isAnnual);
    require(msg.value == price, "Incorrect ETH amount");

    uint256 duration = isAnnual ? 365 days : 30 days;
    Subscription storage sub = subscriptions[msg.sender];

    if (sub.expiresAt >= block.timestamp) {
      sub.expiresAt += duration;
    } else {
      sub.expiresAt = block.timestamp + duration;
    }

    sub.planId = planId;

    emit PlanPurchased(
      msg.sender,
      planId,
      plans[planId].name,
      isAnnual,
      msg.value,
      sub.expiresAt
    );
    
  }

  function addProof(bytes32 contentHash) external whenNotPaused{
    require(hasActiveSubscription(msg.sender), "No active subscription");
    require(proofs[contentHash].owner == address(0) , "Proof already exists");

    proofs[contentHash] = Proof({
      owner : msg.sender,
      timestamp: block.timestamp
    });

    emit ProofCreated(msg.sender, contentHash, block.timestamp);
  }

  function setPlan(uint256 _planId, string calldata _name, uint256 _monthlyPrice, uint256 _discount, bool _isActive) external onlyOwner{
    require(_discount <= 100, "Invalid discount");
    plans[_planId] = Plan(_name, _monthlyPrice, _discount, _isActive);
    emit PlanUpdated(_planId, _name, _monthlyPrice, _discount, _isActive);
  }

  function withdraw() external onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0, "No balance to withdraw");

    (bool success, ) = owner().call{value: balance}("");
    require(success, "Withdraw failed");

    emit Withdrawal(balance, block.timestamp);
  }

  function pause() external onlyOwner { _pause(); }
  function unpause() external onlyOwner { _unpause(); }
}