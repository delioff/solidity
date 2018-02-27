pragma solidity 0.4.20;
/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract VoxPopuli{
    
    address owner;
    uint activemembers;
    mapping(address => uint) public votes;
    
    struct member {
        address hisaddres; // address member
        uint donation;  // ETH donated to contract
        uint date; // timestam for last donation
        uint lastdonation;   // Value of last ETH donation
    }
    
    mapping(address => member) public members;
   
    function VoxPopuli() public {
        owner = msg.sender;
        members[owner]=member(msg.sender,0,now,0);
        activemembers++;
    }
    
    modifier OnlyOwner{
        require(msg.sender == owner);
        _;
    }
    
    function Kill() public OnlyOwner {
        selfdestruct(owner);
    }
    
    //member will be added with initial balanse
    function AddMember(address candidate,uint donation) public {
        require(votes[candidate]>SafeMath.div(activemembers,2));
        members[owner]=member(candidate,donation,now,donation);
    }
    //this function will call only if member aggre with new candidate
    function Vote(address candidate) public{
        votes[candidate]++;
    }
    
    
    function Donate() public payable{
        require(members[msg.sender].hisaddres==msg.sender);//checks if it is member
        members[msg.sender].lastdonation=msg.value;
        members[msg.sender].donation+=msg.value;
        members[msg.sender].date=now;
    }
    
    function Remove(address currentmember) OnlyOwner public{ 
       require(now-members[currentmember].date>1 hours);
       delete members[currentmember];    
       activemembers--;
    }
   
}

