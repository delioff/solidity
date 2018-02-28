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

library MemberLib{
  using SafeMath for uint;
  struct Member {
        address hisaddress;  // address member
        uint donation;       // ETH donated to contract
        uint date;           // timestamp for last donation
        uint lastdonation;   // Value of last ETH donation
  }
  
  function create(Member storage self,address addr,uint amount)
    internal returns(Member) 
  {
    self.hisaddress = addr;
    self.donation.add(amount);
    self.date=now;
    self.lastdonation=amount;
    return self;
  }

 function donate(Member storage self,uint amount)
    internal
  {
     self.donation.add(amount);
     self.date=now;
     self.lastdonation=amount;
  }
 function getDate(Member storage self)
    internal view returns (uint)
  {
     return self.date;
  }
}

contract Owned {
    
    address owner;
    
    function Owned() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
       require(msg.sender == owner);
       _;
    }
   
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
}

contract VoxPopuli is Owned{
    
    using SafeMath for uint;
    using MemberLib for MemberLib.Member;
    MemberLib.Member currentmember;
    mapping(address=>MemberLib.Member) membersvoxpopuli;
    uint activemembers;
    
    mapping(address => uint) public votes;
    
    function VoxPopuli() public {
        owner = msg.sender;
        membersvoxpopuli[owner]= currentmember.create(owner,0);
        activemembers.add(1);
    }
    
    //Member will be added with initial balanse
    function addMember(address candidate,uint initialdonation) public {
        require(votes[candidate]>activemembers.div(2));
        membersvoxpopuli[owner]=currentmember.create(candidate,initialdonation);
    }
    
    //This function will call only if member aggre with new candidate
    function vote(address candidate) public view{
        votes[candidate].add(1);
    }
    
    function donate() public payable{
        require(membersvoxpopuli[msg.sender].hisaddress!=0);//checks if it is member
        membersvoxpopuli[msg.sender].donate(msg.value);
     
    }
    
    function remove(address member) onlyOwner public{ 
       delete membersvoxpopuli[member];
       votes[member]=0;
       activemembers.sub(1);
    }
    
     function removeAuto(address member) public{ 
       require(now-membersvoxpopuli[member].getDate()>1 hours);
       delete membersvoxpopuli[member];
       votes[member]=0;
       activemembers.sub(1);
    }
   
}

