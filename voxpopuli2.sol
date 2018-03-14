pragma solidity ^0.4.19;


//provides basic authorization control functions
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
    
    //the owner shouldn't be transferred as this will mess up our members
    /*function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }*/
}

contract Destructible is Ownable {
    
    function Destructible() public payable { }

    function destroy() onlyOwner public {
        selfdestruct(owner);
    }
    
    function destroyAndSend(address _recipient) onlyOwner public {
        selfdestruct(_recipient);
    }
}

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
        address adr; //an adr value of 0 means that the person is not a member
        uint totalValue; //in wei
        uint importance; //timestamp
        uint lastValue; //in wei
    }
    
    
    function remove(Member storage self) public {
        self.adr = 0;
    }
    
    function initialize(Member storage self, address adr,uint importance) public {
        self.adr = adr;
        self.importance = importance; //give the new member time to donate so he isn't kicked right away
    }

}

contract MemberVoter is Ownable, Destructible {
    using SafeMath for uint; //all integer operations are using the safe library
    using MemberLib for MemberLib.Member;
    
    //define our contract events
    event LogAllVotePoints(uint totaleMembersVotes);
    event LogWithdraw(address indexed adr,uint balance);
    event LogVotingStarted(bytes32 indexed id);
    event LogVotingEnded(bytes32 indexed id, bool successful);
    event LogDonation(address indexed from, uint value);
    
    mapping(address => MemberLib.Member) public members;
    mapping(address => uint) public proposedBalances;
    //we should increase or decrease this counter as members are added and removed
    uint public totaleMembersVotes;
    uint public isinitialized;
    
    struct Voting {
        address proposedAddress;
        uint votesFor;
        uint votesAgainst;
        uint amaunt;
        mapping(address =>  bool) voted;
    }
    
    mapping(bytes32 => Voting) public votings; //the key is the hash of the proposed member and the current timestamp
    
    //we should increase or decrease this counter as votings are added and removed
    //IMPORTANT! No member can be removed when there are active votings.
    uint public activeVotings;
    
    modifier onlyMember {
        //the caller must be a member
        require(members[msg.sender].adr != 0);
        _;
        
    }
    
    
    function init(MemberLib.Member[] initialmembers) public  {
       require(isinitialized == 0);
       uint totalVotePoints = 0;
       for (uint p = 0; p < initialmembers.length; p++) {
            members[initialmembers[p].adr]=initialmembers[p];
            totalVotePoints.add(initialmembers[p].importance);
       }
       totaleMembersVotes.add(totalVotePoints);
       emit LogAllVotePoints(totalVotePoints);
    }
    
    
    function() public payable {
    } 
   
    function withdraw() public {
        require(proposedBalances[msg.sender] > 0);
        uint balance=proposedBalances[msg.sender];
        proposedBalances[msg.sender]=0;
        msg.sender.transfer(balance);
        emit LogWithdraw(msg.sender, balance);
    }
    
    function MakeProposal(address proposedAddress,uint amaunt) public onlyOwner returns (bytes32) {
        bytes32 id = keccak256(proposedAddress, now); //the ID of a vote is the unique hash of the member and the current time 
        
        votings[id] = Voting({proposedMember: proposedAddress, votesFor: 0, votesAgainst: 0,amaunt:amaunt});
        activeVotings = activeVotings.add(1);
        
        emit LogVotingStarted(id);
        
        return id;
    }
    
    function _removeVoting(bytes32 id) private {
        votings[id].proposedAddress = 0;
        activeVotings = activeVotings.sub(1);
    }
    
    function vote(bytes32 id, bool voteFor) public onlyMember {
        require(votings[id].proposedMember != 0); //the voting should exist
        require(!votings[id].voted[msg.sender]);
        
        votings[id].voted[msg.sender] = true;
        
        if(voteFor){ //update the votes count
            votings[id].votesFor = votings[id].votesFor.add(members[msg.sender].importance);
        } else {
            votings[id].votesAgainst = votings[id].votesAgainst.add(members[msg.sender].importance);
        }
        
        if(votings[id].votesFor >= totaleMembersVotes.div(2)){ //if the vote is successful
            proposedBalances[votings[id].proposedAddress]=votings[id].amaunt;
            _removeVoting(id);
            
            emit LogVotingEnded(id, true);
        } else if(votings[id].votesAgainst >= totaleMembersVotes.div(2)) { //unsuccessful vote
            _removeVoting(id);
            emit LogVotingEnded(id, false);
        }
    }
}