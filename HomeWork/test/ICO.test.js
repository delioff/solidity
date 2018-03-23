import ether from '../helpers/ether';
import { advanceBlock } from '../helpers/advanceToBlock';
import { increaseTimeTo, duration } from '../helpers/increaseTime';
import latestTime from '../helpers/latestTime';
import EVMRevert from '../helpers/EVMRevert';

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const ICO = artifacts.require('ICO');


contract('ICO', function ([owner, wallet, investor]) {
  const RATE = new BigNumber(10);
  const GOAL = ether(10);
  const CAP = ether(20);

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.openingTime = latestTime() + duration.weeks(1);
    this.closingPresaleTime = this.openingTime + duration.weeks(1);
    this.closingAfterPresaleTime = this.closingPresaleTime + duration.weeks(1);
    this.ico = await ICO.new(this.openingTime, this.PreSaleTime,this.AfterPreSale); 
  });
   

  it('should create ICO with correct parameters', async function () {
    this.ico.should.exist;
    const openingTime = await this.ico.openingTime();
    const closingPresaleTime = await this.ico.closingPresaleTime();
	const closingAfterPresaleTime = await this.ico.closingAfterPresaleTime();
    openingTime.should.be.bignumber.equal(this.openingTime);
    closingPresaleTime.should.be.bignumber.equal(this.closingPresaleTime);
    closingAfterPresaleTime.should.be.bignumber.equal(this.closingAfterPresaleTime);
  });

  it('should not accept payments before start', async function () {
    await this.ico.send(ether(1)).should.be.rejectedWith(EVMRevert);
    await this.ico.buyTokens(investor, { from: investor, value: ether(1) }).should.be.rejectedWith(EVMRevert);
  });

  it('should accept payments during the sale', async function () {
    const investmentAmount = ether(1);
    const expectedTokenAmount = RATE.mul(investmentAmount);

    await increaseTimeTo(this.openingTime);
    await this.ico.buyTokens(investor, { value: investmentAmount, from: investor }).should.be.fulfilled;

    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
    (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
  });

  
  
});
