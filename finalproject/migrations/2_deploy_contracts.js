
var marketplace = artifacts.require("Marketplace");
var productlib = artifacts.require("ProductLib");

module.exports = function(deployer) {
  deployer.deploy(productlib);
  deployer.link(productlib, marketplace)  
  deployer.deploy(marketplace);
};