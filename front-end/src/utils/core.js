import * as BillsplittingRopsten from '../constants/contracts/ropsten/Billsplitting';
import * as MyBitBurnerRopsten from '../constants/contracts/ropsten/MyBitBurner';
import * as MyBitTokenRopsten from '../constants/contracts/ropsten/MyBitToken';

import * as BillsplittingMainnet from '../constants/contracts/mainnet/Billsplitting';
import * as MyBitBurnerMainnet from '../constants/contracts/mainnet/MyBitBurner';
import * as MyBitTokenMainnet from '../constants/contracts/mainnet/MyBitToken';

import { ETHERSCAN_TX } from '../constants';

const burnValueWei = '250000000000000000000';

const getContract = (name, network, address) => {
  let contract;
  if (network === 'ropsten') {
    switch (name) {
      case 'Billsplitting':
        contract = BillsplittingRopsten;
        break;
      case 'MyBitBurner':
        contract = MyBitBurnerRopsten;
        break;
      case 'MyBitToken':
        contract = MyBitTokenRopsten;
        break;
      default:
        throw new Error('getContract: contract not found');
    }
  } else {
    switch (name) {
      case 'Billsplitting':
        contract = BillsplittingMainnet;
        break;
      case 'MyBitBurner':
        contract = MyBitBurnerMainnet;
        break;
      case 'MyBitToken':
        contract = MyBitTokenMainnet;
        break;
      default:
        throw new Error('getContract: contract not found');
    }
  }
  return new window.web3.eth.Contract(
    contract.ABI,
    contract.ADDRESS,
  );
};

export const loadUserDetails = async network => {
  const accounts = await window.web3.eth.getAccounts();
  const balance = await window.web3.eth.getBalance(accounts[0]);

  const myBitTokenContract = getContract('MyBitToken', network);

  let myBitBalance = await myBitTokenContract.methods
    .balanceOf(accounts[0])
    .call();

  if (myBitBalance > 0) {
    myBitBalance /= 10 ** 18;
  }
  return {
    userName: accounts[0],
    ethBalance: window.web3.utils.fromWei(balance, 'ether'),
    myBitBalance,
  };
};

export const getApprovalLogs = async network =>
  new Promise(async (resolve, reject) => {
    try {
      const mybitTokenContract = getContract('MyBitToken', network);

      const logApprovals = await mybitTokenContract.getPastEvents('Approval', {
        fromBlock: 0,
        toBlock: 'latest',
      });

      resolve(logApprovals);
    } catch (error) {
      reject(error);
    }
  });

export const requestApproval = async (address, network) => {
  const burnerAddress =
    network === 'ropsten'
      ? MyBitBurnerRopsten.ADDRESS
      : MyBitBurnerMainnet.ADDRESS;
  const mybitTokenContract = getContract('MyBitToken', network);

  const estimatedGas = await mybitTokenContract.methods
    .approve(burnerAddress, burnValueWei)
    .estimateGas({ from: address });
  const gasPrice = await window.web3.eth.getGasPrice();

  const { transactionHash } = await mybitTokenContract.methods
    .approve(burnerAddress, burnValueWei)
    .send({
      from: address,
      gas: estimatedGas,
      gasPrice,
    });
  return new Promise((resolve, reject) => {
    checkTransactionStatus(transactionHash, resolve, reject, network);
  });
};

export const getAllowanceOfAddress = async (address, network) => {
  const mybitTokenContract = getContract('MyBitToken', network);
  const allowance = await mybitTokenContract.methods
    .allowance(
      address,
      network === 'ropsten'
        ? MyBitBurnerRopsten.ADDRESS
        : MyBitBurnerMainnet.ADDRESS,
    )
    .call();
  return allowance >= burnValueWei;
};

// Events
export const getNewBillLog = async network => {
  const contract = getContract('Billsplitting', network);
  return contract.getPastEvents('LogNewBill', {
    fromBlock: 0,
    toBlock: 'latest',
  });
}

export const getBillEvents = async (billID, network) => {
  const contract = getContract('Billsplitting', network);
  const events = await contract.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest',
  })
  return events.filter(e => e.returnValues._billID === billID)
}

export const getAllEvents = async network => {
  const contract = getContract('Billsplitting', network);
  return contract.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest',
  });
}

// Getters
export const getTotalOwing = async (billID, network) => {
  const contract = getContract('Billsplitting', network);
  return contract.methods.getTotalOwing(billID).call();
};

export const getUserOwing = async (billID, address, network) => {
  const contract = getContract('Billsplitting', network);
  return contract.methods.getUserOwing(billID).call({
    from: address
  });
};

export const listPayers = async (billID, network) => {
  const contract = getContract('Billsplitting', network);
  return contract.methods.listPayers(billID).call();
}

// Payable
export const payShare = async (billID, amount, from, network) => {
  const contract = getContract('Billsplitting', network);
  const gasPrice = await window.web3.eth.getGasPrice();
  const estimatedGas = await contract.methods
    .payShare(billID)
    .estimateGas({ from, value: amount });

  const { transactionHash } = await contract.methods
    .payShare(billID)
    .send({
      value: amount,
      from,
      gas: estimatedGas,
      gasPrice,
    });
  return new Promise((resolve, reject) => {
    checkTransactionStatus(transactionHash, resolve, reject, network);
  });
};

// External
export const createBillEqual = async (
  reciever,
  total,
  payers,
  from,
  network,
) => {
  const contract = getContract('Billsplitting', network);
  const gasPrice = await window.web3.eth.getGasPrice();
  const estimatedGas = await contract.methods
    .createBillEqual(reciever, total, payers)
    .estimateGas({ from });
  const { transactionHash } = await contract.methods
    .createBillEqual(reciever, total, payers)
    .send({
      from,
      gas: estimatedGas,
      gasPrice,
    });
  return new Promise((resolve, reject) => {
    checkTransactionStatus(transactionHash, resolve, reject, network);
  });
};

export const releaseFunds = async (
  billID,
  from,
  network,
) => {
  const contract = getContract('Billsplitting', network);
  const gasPrice = await window.web3.eth.getGasPrice();
  const estimatedGas = await contract.methods
    .releaseFunds(billID)
    .estimateGas({ from });

  const { transactionHash } = await contract.methods
    .releaseFunds(billID)
    .send({
      from,
      gas: estimatedGas,
      gasPrice,
    });
  return new Promise((resolve, reject) => {
    checkTransactionStatus(transactionHash, resolve, reject, network);
  });
};

export const changeUserAddress = async (
  billID,
  newAddress,
  from,
  network,
) => {
  const contract = getContract('Billsplitting', network);
  const gasPrice = await window.web3.eth.getGasPrice();
  const estimatedGas = await contract.methods
    .changeUserAddress(billID, newAddress)
    .estimateGas({ from });

  const { transactionHash } = await contract.methods
  .changeUserAddress(billID, newAddress)
    .send({
      from,
      gas: estimatedGas,
      gasPrice,
    });
  return new Promise((resolve, reject) => {
    checkTransactionStatus(transactionHash, resolve, reject, network);
  });
};

const checkTransactionStatus = async (
  transactionHash,
  resolve,
  reject,
  network,
) => {
  try {
    const endpoint = ETHERSCAN_TX(transactionHash, network);
    const result = await fetch(endpoint);
    const jsronResult = await result.json();
    if (jsronResult.status === '1') {
      resolve(true);
    } else if (jsronResult.status === '0') {
      resolve(false);
    } else {
      setTimeout(
        () => checkTransactionStatus(transactionHash, resolve, reject, network),
        1000,
      );
    }
  } catch (err) {
    reject(err);
  }
};
