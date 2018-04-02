//this function will be called when the whole page is loaded
window.onload = function(){
	if (typeof web3 === 'undefined') {
		//if there is no web3 variable
		displayMessage("Error! Are you sure that you are using metamask?");
	} else {
		displayMessage("Welcome to Crypto marked World!");
		init();
	}
}

var contractInstance;

var abi =[
	{
		"constant": false,
		"inputs": [
			{
				"name": "ID",
				"type": "bytes32"
			},
			{
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "buy",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "id",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "LogNewProduct",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "newProduct",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "ID",
				"type": "bytes32"
			},
			{
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "getPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "ID",
				"type": "bytes32"
			}
		],
		"name": "getProduct",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "quantity",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getProducts",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "products",
		"outputs": [
			{
				"name": "ID",
				"type": "bytes32"
			},
			{
				"name": "quantity",
				"type": "uint256"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "name",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "ID",
				"type": "bytes32"
			},
			{
				"name": "newQuantity",
				"type": "uint256"
			}
		],
		"name": "update",
		"outputs": [],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]; //TODO

var address = "0xde8ceee9c04db742b1e9657648d54e2136e83573"; //TODO0x5b0b6cb7f078a8f5e9c72702b0ce25e29397389d
var acc;
var canbue=false;
function init(){
	var Contract = web3.eth.contract(abi);
	contractInstance = Contract.at(address);
	updateAccount();
}

function updateAccount(){
	//in metamask, the accounts array is of size 1 and only contains the currently selected account. The user can select a different account and so we need to update our account variable
	acc = web3.eth.accounts[0];
}

function displayMessage(message){
	var el = document.getElementById("message");
	el.innerHTML = message;
}

function getTextInput(el){
	var el = document.getElementById(el);
	
	return el.value;
}
function setTextInput(el,val){
	var el = document.getElementById(el);
	
	el.value=val;
}
function onAddProduct(){
	updateAccount();

	var name = getTextInput("name");
    var price= getTextInput("price");
    var quantity= getTextInput("quantity");
	contractInstance.newProduct(name,price,quantity, {"from": acc}, function(err, res){
		if(!err){
			displayMessage("You added new product! "+res.toString());
		} 
		else {
			displayMessage(err);
		}
	});
	
}




function onGetProduct(){
	updateAccount();

	var input = getTextInput("idproduct");
	var id = web3.sha3(input);
	contractInstance.getProduct.call(id, function(err, res) {
		if(!err){
			displayMessage("Name:  " + res[0]+ "   Quantity:  " +res[2] +"   Price  " +res[1] );
		} 
		else {
			displayMessage("Something went horribly wrong.", err);
		}
	});
	
	
};

function onCalcPrice(){
	updateAccount();

	var name = getTextInput("buyname");
	var quantity= getTextInput("buyquantity");
    var id = web3.sha3(name);
	contractInstance.getProduct.call(id, function(err, res) {
		if(!err){
			if (res[2].toNumber()<web3.toBigNumber(quantity))
			{
				displayMessage("No enogh quantity.");
				canbue=false;
				return;
			}
			setTextInput("buyprice",res[1].toNumber()*web3.toBigNumber(quantity));
			displayMessage("Продажната цена е "+getTextInput("buyprice"));
			canbue=true;
			
		} 
		else {
			displayMessage("Something went horribly wrong.", err);
			canbue=false;
		}
	});
};
function onBuyProduct(){
	if (!canbue){
        displayMessage("You can't bue product!");
		return;
	} 
	updateAccount();

	var name = getTextInput("buyname");
	var quantity= getTextInput("buyquantity");
	var price= getTextInput("buyprice");
    var id = web3.sha3(name);
	contractInstance.buy(id,quantity,{"from": acc,"value": price,"gas": 3000000},function(err, res) {
		if(!err){
			if (res[2].toNumber()<web3.toBigNumber(quantity))
			{
				displayMessage("No enogh quantity.");
				return;
			}
			setTextInput("buyprice",res[1].toNumber()*web3.toBigNumber(quantity));
			displayMessage("Продажната цена е "+getTextInput("bueprice"));
		} 
		else {
			displayMessage(err);
		}
	});
};