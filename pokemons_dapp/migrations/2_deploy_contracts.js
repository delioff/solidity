var Pokemons = artifacts.require("./Pokemons.sol");

module.exports = function(deployer) {
  deployer.deploy(Pokemons);
};
