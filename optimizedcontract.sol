pragma solidity 0.4.21;

//this contract is optimized, don't touch it.
contract Ownable {
    address public owner;
    
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    
    function Ownable() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

}

//The objective is to have a contract that has members. The members are added by the owner and hold information about their address, timestamp of being added to the contract and amount of funds donated. Each member can donate to the contract.
//Many anti-patterns have been used to create them.
//Some logical checks have been missed in the implementation.
//Objective: lower the publish/execution gas costs as much as you can and fix the logical checks.

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        //there is no case where this function can overflow/underflow
        uint256 c = a / b;
        return c;
    }
    
    
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

library MemberLib {
    using SafeMath for uint;
    
    struct Member {
         address adr;
         uint joinedAt;
         uint fundsDonated;
    }
    
    function remove(Member storage self) public {
        self.adr = 0;
    }
    
    function initialize(Member storage self, address adr) public {
        self.adr=adr;
        self.joinedAt=now;
    }
    
    function donate(Member storage self, uint donatedValue) public {
        self.fundsDonated.add(donatedValue);
    }
}

contract Members is Ownable{
     using SafeMath for uint;
    using MemberLib for MemberLib.Member;
    mapping(address => MemberLib.Member) public members;
    uint memberscount;
    modifier onlyMember {
        require(members[msg.sender].adr != 0);
        _;
    }
    
    function addMember(address adr) public onlyOwner {
        members[adr].initialize(adr);
        memberscount.add(1); 
    }
    
    function donate() public onlyMember payable {
        require(msg.value > 0);
        members[msg.sender].donate(msg.value);
    }
}