/* global web3, $, App */
import '../stylesheets/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import pokemonsArtifacts from '../../build/contracts/Pokemons.json'

var Pokemons = contract(pokemonsArtifacts)

window.App = {
  start: function () {
    // Bootstrap the MetaCoin abstraction for Use.
    Pokemons.setProvider(web3.currentProvider)

    $('#claim-pokemon').submit(function (event) {
      event.preventDefault()
      let pokemonIndex = $('#pokemon-index').val()
      Pokemons.deployed().then(function (contract) {
        contract.catchPokemon(parseInt(pokemonIndex), { from: web3.eth.accounts[0], gas: 440000 })
          .then(function (f) {
            $('#msg-error').hide()
            $('#msg').html('Your claim has been submitted.').show()
          })
          .catch(function (e) {
            $('#msg').hide()
            $('#msg-error').html(e.message).show()
          })
      })
    })

    $('#read-pokemons-by-address').submit(function (event) {
      event.preventDefault()
      let pokemonsAddress = $('#pokemons-address').val()
      Pokemons.deployed().then(function (contract) {
        contract.getPokemonsByPerson(pokemonsAddress, { from: web3.eth.accounts[0], gas: 440000 })
          .then(function (f) {
            $('#msg-error').hide()
            if (f && f.length) {
              $('#msg').html(f.join(', ')).show()
            } else {
              $('#msg').hide()
            }
          })
          .catch(function (e) {
            $('#msg').hide()
            $('#msg-error').html(e.message).show()
          })
      })
    })

    $('#read-holders-by-pokemon-index').submit(function (event) {
      event.preventDefault()
      let pokemonIndex = $('#read-holders-by-pokemon-index #pokemon-index').val()
      Pokemons.deployed().then(function (contract) {
        contract.getPokemonHolders(parseInt(pokemonIndex), { from: web3.eth.accounts[0], gas: 440000 })
          .then(function (f) {
            $('#msg-error').hide()
            if (f && f.length) {
              $('#msg').html(f.join(', ')).show()
            } else {
              $('#msg').hide()
            }
          })
          .catch(function (e) {
            $('#msg').hide()
            $('#msg-error').html(e.message).show()
          })
      })
    })
  }
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"))
  }

  App.start()
})
