import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import BlockchainInfoContext from './BlockchainInfoContext';
import * as Core from '../utils/core';
import { EventNames } from '../constants';

class BlockchainInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: {
        user: true,
        userBills: true,
        userTransactions: true,
        network: true,
      },
      user: {
        myBitBalance: 0,
        etherBalance: 0,
        userName: '',
      },
      currentBlock: 0,
      requestApproval: this.requestApproval,
      checkAddressAllowed: this.checkAddressAllowed,
      getUserOwing: this.getUserOwing,
      getUserBills: this.getUserBills,
      getUserTransactions: this.getUserTransactions,
      payShare: this.payShare,
      createBillEqual: this.createBillEqual,
      releaseFunds: this.releaseFunds,
      // can be ropsten or main - else unknown
      network: '',
      userBills: [],
      userTransactions: [],
    };
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      throw new Error(
        'No web3 detected, please install metamask or use an ethereum browser',
      );
    }
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.getNetwork();
    await this.loadUserDetails(this.state.network);
    await this.getUserBills();
    await this.getUserTransactions();
    await this.checkAddressAllowed();
    window.web3.currentProvider.publicConfigStore.on('update', data => {
      if (
        data.selectedAddress.toUpperCase() !==
        this.state.user.userName.toUpperCase()
      )
        window.location.reload();
    });
  }

  async loadUserDetails() {
    const user = await Core.loadUserDetails(this.state.network);
    this.setState({
      user,
      loading: { ...this.state.loading, user: false },
    });
  }

  async getNetwork() {
    const network = await window.web3.eth.net.getNetworkType();
    this.setState({
      network,
      loading: {
        ...this.state.loading,
        network: false,
      },
    });
  }

  getUserOwing = async billID =>
    Core.getUserOwing(
      billID,
      this.state.user.userName,
      this.state.network,
    );

  payShare = async billID => {
    console.log('billID', billID)
    const amount = await this.getUserOwing(billID)
    console.log('amount', amount)
    return Core.payShare(
      billID,
      amount,
      this.state.user.userName,
      this.state.network,
    )
  }

  createBillEqual = async (reciever, total, payers) =>
  Core.createBillEqual(
    reciever,
    window.web3.utils.toWei(total),
    payers,
    this.state.user.userName,
    this.state.network,   
  )

  
  releaseFunds = async billID => 
    Core.releaseFunds(
      billID,
      this.state.user.userName,
      this.state.network,
    )

  getUserTransactions = async () => {
    const events = await Core.getAllEvents(
      this.state.network
    )
    const transactions = await Promise.all(events.map(async e => {
      let tx = await window.web3.eth.getTransaction(e.transactionHash)
      tx.name = EventNames[e.event]
      const block = await window.web3.eth.getBlock(e.blockNumber)
      tx.date = new Date(block.timestamp * 1000).toUTCString()
      return tx;
    }))
    const userTransactions = transactions.filter(t => t.from === this.state.user.userName)
    this.setState({
      userTransactions,
      loading: {
        ...this.state.loading,
        userBills: false,
        userTransactions: false,
      },
    });
    this.setState({
      userTransactions,
      loading: {
        ...this.state.loading,
        userBills: false,
      },
    });
    console.log('userTransactions', userTransactions)
  }

  getUserBills = async () => {
    try {
      const newBillLog = await Core.getNewBillLog(
        this.state.network,
      );
      const userBills = await Promise.all(
        newBillLog.map(async log => {
          const payers = await Core.listPayers(
            log.returnValues._billID,
            this.state.network,
          );
          const totalOwing = await Core.getTotalOwing(
            log.returnValues._billID,
            this.state.network,
          );
          const userOwing = await Core.getUserOwing(
            log.returnValues._billID,
            this.state.user.userName,
            this.state.network,
          )
          const events = await Core.getBillEvents(
            log.returnValues._billID,
            this.state.network,
          );
          if (payers.some(payer => payer === this.state.user.userName)) {
            return {
              billID: log.returnValues._billID,
              totalOwing,
              userOwing,
              payee: log.returnValues._receiver,
              numPayers: payers.length,
              payers: payers.map((address, i) => ({
                address,
                paid: events.some(e => e.event === "LogSharePaid" && e.returnValues._payer === address),
                billID: log.returnValues._billID,
              })),
            };
          }
        }),
      )
      this.setState({
        userBills,
        loading: {
          ...this.state.loading,
          userBills: false,
        },
      });
      console.log('userBills', userBills)
    } catch (e) {
      console.log(e);
      setTimeout(this.getUserBills, 5000);
    }
  }

  requestApproval = () =>
    Core.requestApproval(this.state.user.userName, this.state.network);

  checkAddressAllowed = async () => {
    try {
      const allowed = await Core.getAllowanceOfAddress(
        this.state.user.userName,
        this.state.network,
      );
      this.setState({ userAllowed: allowed });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <BlockchainInfoContext.Provider value={this.state}>
        {this.props.children}
      </BlockchainInfoContext.Provider>
    );
  }
}

export default BlockchainInfo;

BlockchainInfo.propTypes = {
  children: PropTypes.node.isRequired,
};
