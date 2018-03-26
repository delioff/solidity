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

var abi = [
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

var address = "0x8cdaf0cd259887258bc13a92c0a6da92698644c0"; //TODO
var acc;

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

function onAddProduct(){
	updateAccount();

	var name = getTextInput("name");
    var price= getTextInput("price");
    var quantity= getTextInput("quantity");
	contractInstance.newProduct.call(name,price,quantity, {"from": acc}, function(err, res){
		if(!err){
			displayMessage("You added new product!");
		} 
		else {
		displayMessage("You cant' add product!");
		}
	});
	
}




function onGetProduct(){
	updateAccount();

	var input = getTextInput("idproduct");

	var counter = input.length;


	
		contractInstance.getPokemonsByPerson.call(input, function(err, res) {
		if(!err){
			displayMessage(res.valueOf());
		} 
		else {
			displayMessage("Something went horribly wrong.", err);
		}
	});
	
	
};

