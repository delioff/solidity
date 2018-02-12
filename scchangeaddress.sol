pragma solidity 0.4.19;
contract Owner {
    
    address owner;
    event ChangeOwner(address indexed oldowner,address indexed newowner);
    
    function Owner() public {
        owner=msg.sender;
    }
   
    function GetOwner() public returns (address){
        return owner;
    }
    
    function changeOwner(address newowner) public returns (address,address) {
    
        if (owner==msg.sender)
        {
            ChangeOwner(newowner,owner);
            owner=newowner;
        }
        return (newowner,msg.sender);
    }
}