pragma solidity 0.4.19;
contract Holder {
    uint state=0;
    uint lastinc=0;
    address owner;
    event Incremention(uint timestamp,uint _state);
    
    function Holder(uint initialstate) public {
       state=initialstate;
       lastinc=now;
       owner=msg.sender;
    }
   
    function increment() public returns (uint) {
    
        if ( (now-lastinc) >= 15 seconds && owner==msg.sender)
        {
            state++;
            lastinc=now;
            Incremention(now,state);
        }
        return state;
    }
}