//this function will be called when the whole page is loaded
window.onload = function(){
	if (typeof web3 === 'undefined') {
		//if there is no web3 variable
		displayMessage("Error! Are you sure that you are using metamask?");
	} else {
		displayMessage("Welcome to Pokemòn World!");
		init();
	}
}

var contractInstance;

var abi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "person",
				"type": "address"
			}
		],
		"name": "getPokemonsByPerson",
		"outputs": [
			{
				"name": "",
				"type": "uint8[]"
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
				"name": "pokemon",
				"type": "uint8"
			}
		],
		"name": "getPokemonHolders",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "pokemon",
				"type": "uint8"
			}
		],
		"name": "catchPokemon",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "by",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "pokemon",
				"type": "uint8"
			}
		],
		"name": "LogPokemonCaught",
		"type": "event"
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

function getTextInput(){
	var el = document.getElementById("input");
	
	return el.value;
}

function onButtonPressed(){
	updateAccount();

	var input = getTextInput();


	if(input<0 || input>31) {
		displayMessage("Such pokemon doesn't exist!");
	}
	else {
		contractInstance.catchPokemon(input, {"from": acc}, function(err, res){
			if(!err){
				displayMessage("You have catched a pokemon!");
			} 
			else {
			displayMessage("You have already catched this pokemon!");
			}
		});
	}
}




function onSecondButtonPressed(){
	updateAccount();

	var input = getTextInput();

	var counter = input.length;


	if(counter==42) {
		contractInstance.getPokemonsByPerson.call(input, function(err, res) {
		if(!err){
			if(res.valueOf()!=0) {
				if(res.valueOf()==1) {
			displayMessage("The current account has  pokemon " + res.valueOf() + "!");
				}
				else {
					displayMessage("The current account has pokemons " + res.valueOf() + "!");
				}
			}
			else {
				displayMessage("This account has no pokemons! Hurry and CATCH 'EM ALL!")
			}
		} 
		else {
			displayMessage("Something went horribly wrong.", err);
		}
	});
	}

	else if(input.valueOf()>=0 && input.valueOf()<=31) {
		contractInstance.getPokemonHolders.call(input, function(err,res) {
			if(res.valueOf()!=0) {
				if(!err) {
					if(res.valueOf()==1) {
						displayMessage("The owner of this pokemon is " + res.valueOf());
					}
					else {
						displayMessage("The owners of this pokemon are " + res.valueOf());
					}
				}
				else {
					displayMessage("Error",err);
				}
			}
			else {
				displayMessage("There are no owners of this pokemon!");
			}
		});
	}
	else {
		displayMessage("This is not an account, nor is it a index of Pokemon!");
	}
	
	
};

