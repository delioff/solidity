pragma solidity ^0.4.18;

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
library ProductLib {
    using SafeMath for uint;
    
    struct Product {
        bytes32 ID;
        uint quantity; 
        uint price;
        string name;
    }
    
    function initialize(Product storage self,bytes32 ID, uint quantity, uint price,string name) public {
        self.ID = ID;
        self.quantity = quantity; 
		self.price=price;
		self.name=name;
    }
    
    function update(Product storage self, uint quantity, uint price) public {
        self.quantity = quantity; 
		self.price=price;
    }
    
    function updatequantity(Product storage self,uint quantity) view public {
        self.quantity.add(quantity); 
    }
}
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


contract Marketplace is Ownable{
    
	using SafeMath for uint; //all integer operations are using the safe library
    using ProductLib for ProductLib.Product;
    mapping(bytes32 => ProductLib.Product) public products;
    bytes32[] store;
    //define our contract events
    event LogNewProduct(bytes32 indexed id,uint quantity);
    
	
    function buy(bytes32 ID, uint quantity) public payable {
        require(products[ID].quantity>=quantity);
        require(quantity.mul(products[ID].price)<=msg.value);
        products[ID].quantity.sub(quantity);
    }
    
    function update(bytes32 ID, uint newQuantity) view public {
        products[ID].updatequantity(newQuantity);
    }
    
    //creates a new product and returns its ID
    function newProduct(string name, uint price, uint quantity) public returns(bytes32) {
	     bytes32 id = keccak256(name); 
		 products[id].initialize(id,quantity,price,name);
		 store.push(id);
		 emit LogNewProduct(id,quantity);
		 return id;
	}
    
    function getProduct(bytes32 ID) public view returns(string name, uint price, uint quantity) {
        return (products[ID].name,products[ID].price, products[ID].quantity); 
    }
    
    function getProducts() public view returns(bytes32[]) {
        return store;
    }
    
    function getPrice(bytes32 ID, uint quantity) public view returns (uint) {
        return (products[ID].price.mul(quantity));
    }
}