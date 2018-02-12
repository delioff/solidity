pragma solidity ^0.4.19;
contract ServiceByer {
    address owner;
    uint lastbye=0;
    uint lastwithdraw=0;
    mapping (address => uint) public registrantsPaid;
    
    event ConfirmByeService(address indexed to,bool sucsses,uint moneyback);
    
    function ServiceByer() public{
        owner=msg.sender;
    }
    modifier onlyOwner {
        require(msg.sender==owner);
        _;
    }
    modifier canByeService {
        require(now-lastbye>=2 minutes);
        _;
    }
    
     modifier canWithdraw {
        require(now-lastwithdraw>=1 hours);
        _;
    }
    
    function() public payable{
    }
    
    function withdraw() onlyOwner canWithdraw public {
       lastwithdraw=now;
       if (this.balance>5 ether)
       {
           owner.transfer(5 ether);
       }
       else
       {
           owner.transfer(this.balance);
       }
        
    }
    
    function byeService() canByeService payable public {
        require(msg.value>=1 ether);
        lastbye=now;
        registrantsPaid[msg.sender] =1 ether;
        if (msg.value>1 ether)
        {
            msg.sender.transfer(msg.value-1 ether);
            ConfirmByeService(msg.sender,true,msg.value-1 ether);
        }
        else
        {
            ConfirmByeService(msg.sender,true,0);
        }
    }
    
   function getContractBalance() constant public returns (uint){
    return this.balance;    
  }

}