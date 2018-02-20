pragma solidity ^0.4.20;

contract PeopleBalances {
    address owner;
    mapping(address => uint) public balances;
    mapping(address => bool) public tokenHolder;
    address[] public tokenHolders;
    uint startCroudSale;
    
    modifier incrowdsale() {
        require(now - startCroudSale < 5 minutes);
        _;
    }
    
    modifier startExchange() {
        require(now - startCroudSale >= 5 minutes);
        _;
    }
    
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    
    function PeopleBalances() public{
        owner = msg.sender;
        startCroudSale = now;
    }
    
    function initialOffering() incrowdsale public payable{
        balances[msg.sender] += msg.value*5;
        if(tokenHolder[msg.sender] == false){
            tokenHolders.push(msg.sender);
        }
		tokenHolder[msg.sender] = true;
    }
    
    function secondaryMarket(address sendTo, uint amount) startExchange public{
        require(balances[msg.sender] >= amount && tokenHolder[msg.sender]);
        balances[sendTo] += amount;
        balances[msg.sender] -= amount;
       
    }
    function() public payable{
    }
	
	function withdraw(uint amount) onlyOwner public{
        require((now - startCroudSale > 1 years) && amount <= this.balance);
        owner.transfer(amount);
    }
    
    function getTokenHolders() public view returns(address[]){
        return tokenHolders;
    }
}