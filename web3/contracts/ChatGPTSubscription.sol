// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract ChatGPTSubscription is ReentrancyGuard, Ownable, Pausable {
    
    // Subscription tiers
    enum SubscriptionTier {
        NONE,
        BASIC,
        PREMIUM,
        ENTERPRISE
    }
    
    // Subscription structure
    struct Subscription {
        SubscriptionTier tier;
        uint256 startTime;
        uint256 endTime;
        uint256 lastPayment;
        bool isActive;
        bool autoRenew;
    }
    
    // Tier pricing structure
    struct TierPricing {
        uint256 monthlyPrice;
        uint256 yearlyPrice;
        uint256 maxQueries;
        bool unlimited;
        string features;
    }
    
    // Events
    event SubscriptionCreated(address indexed user, SubscriptionTier tier, uint256 duration);
    event SubscriptionRenewed(address indexed user, SubscriptionTier tier, uint256 newEndTime);
    event SubscriptionCancelled(address indexed user);
    event PaymentProcessed(address indexed user, uint256 amount, SubscriptionTier tier);
    event TierUpdated(SubscriptionTier tier, uint256 monthlyPrice, uint256 yearlyPrice);
    event QueryUsed(address indexed user, uint256 remainingQueries);
    
    // State variables
    mapping(address => Subscription) public subscriptions;
    mapping(address => uint256) public queryUsage;
    mapping(SubscriptionTier => TierPricing) public tierPricing;
    
    uint256 public constant MONTH_DURATION = 30 days;
    uint256 public constant YEAR_DURATION = 365 days;
    uint256 public totalRevenue;
    uint256 public totalSubscribers;
    
    // Treasury and fee structure
    address public treasury;
    uint256 public protocolFee = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    constructor(address _treasury) {
        treasury = _treasury;
        
        // Initialize tier pricing
        tierPricing[SubscriptionTier.BASIC] = TierPricing({
            monthlyPrice: 0.01 ether,
            yearlyPrice: 0.1 ether,
            maxQueries: 1000,
            unlimited: false,
            features: "Basic AI chat, limited queries"
        });
        
        tierPricing[SubscriptionTier.PREMIUM] = TierPricing({
            monthlyPrice: 0.025 ether,
            yearlyPrice: 0.25 ether,
            maxQueries: 10000,
            unlimited: false,
            features: "Advanced AI, priority support, higher limits"
        });
        
        tierPricing[SubscriptionTier.ENTERPRISE] = TierPricing({
            monthlyPrice: 0.1 ether,
            yearlyPrice: 1 ether,
            maxQueries: 0,
            unlimited: true,
            features: "Unlimited queries, API access, custom training"
        });
    }
    
    // Subscribe to a tier
    function subscribe(SubscriptionTier _tier, bool _yearly, bool _autoRenew) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(_tier != SubscriptionTier.NONE, "Invalid tier");
        require(msg.value > 0, "Payment required");
        
        TierPricing memory pricing = tierPricing[_tier];
        uint256 requiredPayment = _yearly ? pricing.yearlyPrice : pricing.monthlyPrice;
        uint256 duration = _yearly ? YEAR_DURATION : MONTH_DURATION;
        
        require(msg.value >= requiredPayment, "Insufficient payment");
        
        Subscription storage userSub = subscriptions[msg.sender];
        
        // If user has active subscription, extend it
        if (userSub.isActive && userSub.endTime > block.timestamp) {
            userSub.endTime += duration;
        } else {
            // New subscription
            userSub.tier = _tier;
            userSub.startTime = block.timestamp;
            userSub.endTime = block.timestamp + duration;
            userSub.isActive = true;
            totalSubscribers++;
        }
        
        userSub.lastPayment = block.timestamp;
        userSub.autoRenew = _autoRenew;
        
        // Reset query usage for new billing period
        queryUsage[msg.sender] = 0;
        
        // Process payment
        _processPayment(msg.value);
        
        emit SubscriptionCreated(msg.sender, _tier, duration);
        emit PaymentProcessed(msg.sender, msg.value, _tier);
        
        // Refund excess payment
        if (msg.value > requiredPayment) {
            payable(msg.sender).transfer(msg.value - requiredPayment);
        }
    }
    
    // Check if user has active subscription
    function hasActiveSubscription(address _user) public view returns (bool) {
        Subscription memory userSub = subscriptions[_user];
        return userSub.isActive && userSub.endTime > block.timestamp;
    }
    
    // Check if user can make query
    function canMakeQuery(address _user) public view returns (bool) {
        if (!hasActiveSubscription(_user)) {
            return false;
        }
        
        Subscription memory userSub = subscriptions[_user];
        TierPricing memory pricing = tierPricing[userSub.tier];
        
        if (pricing.unlimited) {
            return true;
        }
        
        return queryUsage[_user] < pricing.maxQueries;
    }
    
    // Use a query (called by service)
    function useQuery(address _user) external onlyOwner {
        require(hasActiveSubscription(_user), "No active subscription");
        require(canMakeQuery(_user), "Query limit exceeded");
        
        Subscription memory userSub = subscriptions[_user];
        TierPricing memory pricing = tierPricing[userSub.tier];
        
        if (!pricing.unlimited) {
            queryUsage[_user]++;
            emit QueryUsed(_user, pricing.maxQueries - queryUsage[_user]);
        }
    }
    
    // Get remaining queries
    function getRemainingQueries(address _user) public view returns (uint256) {
        if (!hasActiveSubscription(_user)) {
            return 0;
        }
        
        Subscription memory userSub = subscriptions[_user];
        TierPricing memory pricing = tierPricing[userSub.tier];
        
        if (pricing.unlimited) {
            return type(uint256).max;
        }
        
        uint256 used = queryUsage[_user];
        return used >= pricing.maxQueries ? 0 : pricing.maxQueries - used;
    }
    
    // Cancel subscription
    function cancelSubscription() external {
        Subscription storage userSub = subscriptions[msg.sender];
        require(userSub.isActive, "No active subscription");
        
        userSub.autoRenew = false;
        
        emit SubscriptionCancelled(msg.sender);
    }
    
    // Get user subscription details
    function getSubscriptionDetails(address _user) 
        external 
        view 
        returns (
            SubscriptionTier tier,
            uint256 startTime,
            uint256 endTime,
            bool isActive,
            bool autoRenew,
            uint256 remainingQueries
        ) 
    {
        Subscription memory userSub = subscriptions[_user];
        return (
            userSub.tier,
            userSub.startTime,
            userSub.endTime,
            hasActiveSubscription(_user),
            userSub.autoRenew,
            getRemainingQueries(_user)
        );
    }
    
    // Get tier pricing
    function getTierPricing(SubscriptionTier _tier) 
        external 
        view 
        returns (
            uint256 monthlyPrice,
            uint256 yearlyPrice,
            uint256 maxQueries,
            bool unlimited,
            string memory features
        ) 
    {
        TierPricing memory pricing = tierPricing[_tier];
        return (
            pricing.monthlyPrice,
            pricing.yearlyPrice,
            pricing.maxQueries,
            pricing.unlimited,
            pricing.features
        );
    }
    
    // Admin functions
    function updateTierPricing(
        SubscriptionTier _tier, 
        uint256 _monthlyPrice, 
        uint256 _yearlyPrice,
        uint256 _maxQueries,
        bool _unlimited,
        string memory _features
    ) external onlyOwner {
        tierPricing[_tier] = TierPricing({
            monthlyPrice: _monthlyPrice,
            yearlyPrice: _yearlyPrice,
            maxQueries: _maxQueries,
            unlimited: _unlimited,
            features: _features
        });
        
        emit TierUpdated(_tier, _monthlyPrice, _yearlyPrice);
    }
    
    function updateProtocolFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        protocolFee = _newFee;
    }
    
    function updateTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid address");
        treasury = _newTreasury;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Emergency withdrawal
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(treasury).transfer(balance);
    }
    
    // Internal function to process payments
    function _processPayment(uint256 _amount) internal {
        uint256 fee = (_amount * protocolFee) / FEE_DENOMINATOR;
        uint256 netAmount = _amount - fee;
        
        totalRevenue += netAmount;
        
        // Transfer to treasury
        if (address(this).balance >= netAmount) {
            payable(treasury).transfer(netAmount);
        }
    }
    
    // Auto-renewal function (would be called by a keeper/automation service)
    function processAutoRenewal(address _user) external onlyOwner {
        Subscription storage userSub = subscriptions[_user];
        require(userSub.autoRenew, "Auto-renewal not enabled");
        require(userSub.endTime <= block.timestamp + 1 days, "Too early for renewal");
        
        // This would require integration with a payment processor
        // For now, we'll just extend if they have sufficient balance locked
        // In a real implementation, you'd integrate with payment processors
        
        emit SubscriptionRenewed(_user, userSub.tier, userSub.endTime + MONTH_DURATION);
    }
    
    // Get contract statistics
    function getContractStats() 
        external 
        view 
        returns (
            uint256 _totalRevenue,
            uint256 _totalSubscribers,
            uint256 _contractBalance
        ) 
    {
        return (
            totalRevenue,
            totalSubscribers,
            address(this).balance
        );
    }
    
    // Fallback function
    receive() external payable {
        revert("Use subscribe function");
    }
}
