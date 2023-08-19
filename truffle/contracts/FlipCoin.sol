// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the necessary ERC-20 interface
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Inherit from the ERC-20 contract
contract FlipCoin is ERC20 {

    uint256 public purchase_rewards;
    uint256 public purchase_referrals;
    uint256 public purchase_socialMedia;
    uint256 public staking;
    uint256 public partners;
    uint256 public currentOrder;
    uint256 public expireTime = 300;
    uint256 public socialMediaReward = 5;
    uint256 public referralReward = 5;
    uint256 public currentMintAmount = 0;
    address public ownerAddress;
    address public tokenAddress;

    enum OrderStatus
    {
        Confirmed,
        Cancelled,
        NotReturned,
        Expired
    }
    enum OrderType
    {
        Purchase,
        Airdrop,
        SocialPost,
        Stake
    }
    struct Order
    {
        uint256 id;
        uint256 lastReturnDate;
        uint256 flipCoin;
        address userAccount;
        address referrer;
        bool isReferred;
        OrderStatus status;
        OrderType orderType;
    }

    mapping(uint256=>Order) public orders;
    mapping(address=>uint256) public expectedBalance;
    mapping(uint256=>uint256) public totalReferrals;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(address(this), 10000000 * 10 ** decimals());
        currentMintAmount = 10000000;
        ownerAddress = msg.sender;
        tokenAddress = address(this);
    }
    function distributeToPartners(address[] memory sellers) external 
    {
        for(uint256 i=0;i<sellers.length;i++)
        {
            IERC20 token = IERC20(tokenAddress);
            token.transfer(sellers[i], (currentMintAmount * 5)/100);
        }
    }
    function removeSeller(address seller) external 
    {
        _burn(seller, balanceOf(seller));
    }
    function mint(uint256 amount) external 
    {
        require(ownerAddress == msg.sender);
        _mint(address(this), amount * 10 ** decimals());
        currentMintAmount = amount;
    }
    function depositCoint() external {
        for(uint256 i=0;i<currentOrder;i++)
        {
            if(orders[i].status == OrderStatus.Confirmed && block.timestamp >= orders[i].lastReturnDate)
            {
                if(orders[i].orderType == OrderType.Airdrop)
                {
                    require((totalSupply() * 5)/100 > partners, "Running Low on Tokens");
                    partners += orders[i].flipCoin;
                }
                else if(orders[i].orderType == OrderType.SocialPost)
                {
                    require((totalSupply() * 5)/100 > purchase_socialMedia, "Running Low on Tokens");
                    purchase_socialMedia += orders[i].flipCoin;
                }
                else if(orders[i].orderType == OrderType.Stake)
                {
                    require((totalSupply() * 15)/100 > staking, "Running Low on Tokens");
                    staking += orders[i].flipCoin;
                }
                else 
                {
                    require((totalSupply() * 40)/100 > purchase_rewards, "Running Low on Tokens");
                    purchase_rewards += orders[i].flipCoin;
                }
                orders[i].status = OrderStatus.NotReturned;
                IERC20 token = IERC20(tokenAddress);
                token.transfer(orders[i].userAccount, orders[i].flipCoin);
                expectedBalance[orders[i].userAccount] += orders[i].flipCoin;
                if(orders[i].isReferred)
                {
                    require((totalSupply() * 15)/100 > purchase_referrals, "Running Low on Tokens");
                    IERC20 tokenRef = IERC20(tokenAddress);
                    tokenRef.transfer(orders[i].referrer, referralReward);
                    expectedBalance[orders[i].referrer] += referralReward;
                    purchase_referrals += referralReward;
                }
            }

        }
    }
    function deductCoin() payable external {
        for(uint256 i=0;i<currentOrder;i++)
        {
            if(orders[i].status == OrderStatus.NotReturned && block.timestamp >= orders[i].lastReturnDate + expireTime)
            {
                if(balanceOf(orders[i].userAccount) > (expectedBalance[orders[i].userAccount] - orders[i].flipCoin))
                {
                    uint256 extraAmount = balanceOf(orders[i].userAccount) - (expectedBalance[orders[i].userAccount] - orders[i].flipCoin);
                    _burn(orders[i].userAccount, extraAmount);
                }
                expectedBalance[orders[i].userAccount] -= orders[i].flipCoin;
                if(orders[i].isReferred)
                {
                    if(balanceOf(orders[i].referrer) > (expectedBalance[orders[i].referrer] - referralReward))
                    {
                        uint256 extraAmount = balanceOf(orders[i].referrer) - (expectedBalance[orders[i].referrer] - referralReward);
                        _burn(orders[i].referrer, extraAmount);
                    }
                    expectedBalance[orders[i].referrer] -= referralReward;
                }
                orders[i].status = OrderStatus.Expired;
            }
        }
    }
    function purchase(uint256 productPrice,address userAccount, uint256 lastReturnDate,bool isReferred, address referrer)external {
        Order memory newOrder;
        newOrder.id = currentOrder;
        if(productPrice/50 >= 100){
        newOrder.flipCoin = 100;
        }
        else{
            newOrder.flipCoin = productPrice / 50;
        }
        newOrder.userAccount = userAccount;
        newOrder.status = OrderStatus.Confirmed;
        newOrder.lastReturnDate = lastReturnDate;
        newOrder.orderType = OrderType.Purchase;
        if(isReferred)
        {
            newOrder.isReferred = true;
            newOrder.referrer = referrer;
        }
        else 
        {
            newOrder.isReferred = false;
        }
        orders[currentOrder] = newOrder;
        currentOrder++;
    }
    function disperseCoin(address seller, uint256 amount, address userAccount) external {
        require(balanceOf(seller) >= amount, "Seller has not enough amount of Tokens");
        require((totalSupply() * 5)/100 > partners, "Running Low on Tokens");
        Order memory newOrder;
        newOrder.id = currentOrder;
        newOrder.flipCoin = amount;
        newOrder.isReferred = false;
        newOrder.lastReturnDate = block.timestamp;
        newOrder.status = OrderStatus.Confirmed;
        newOrder.userAccount = userAccount;
        newOrder.orderType = OrderType.Airdrop;
        orders[currentOrder] = newOrder;
        _burn(seller, amount);
        currentOrder++;
    }
    function cancleOrder(uint256 orderId) external 
    {
        require(orders[orderId].lastReturnDate > block.timestamp);
        orders[orderId].status = OrderStatus.Cancelled;
    }
    function socialMediaPost(address userAccount) external 
    {
        Order memory newOrder;
        newOrder.id = currentOrder;
        newOrder.flipCoin = socialMediaReward;
        newOrder.isReferred = false;
        newOrder.lastReturnDate = block.timestamp;
        newOrder.status = OrderStatus.Confirmed;
        newOrder.userAccount = userAccount;
        newOrder.orderType = OrderType.SocialPost;
        orders[currentOrder] = newOrder;
        currentOrder++;
    }
    function redeem(address userAccount, uint256 amount) external 
    {
        require(balanceOf(userAccount) >= amount && amount > 0, "Insufficient balance");
        _burn(userAccount, amount);
    }
    function stakeTokens(uint256 amount, address userAccount, uint256 interval) external {
        require(amount >0 && amount <= balanceOf(userAccount), "Insufficient balance");
        _transfer(userAccount, address(this) ,amount);
        Order memory newOrder;
        newOrder.id = currentOrder;
        newOrder.flipCoin = amount + amount/10;
        newOrder.isReferred = false;
        newOrder.lastReturnDate = block.timestamp + interval;
        newOrder.status = OrderStatus.Confirmed;
        newOrder.orderType = OrderType.Stake;
        newOrder.userAccount = userAccount;
        orders[currentOrder] = newOrder;
        currentOrder++;
    }
}
