export const ETHERSCAN_TX = (txHash, network) => {
  if (network === 'ropsten') {
    return `https://api-ropsten.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}`;
  }

  return `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}`;
};

export const ETHERSCAN_TX_FULL_PAGE = (txHash, network) => {
  if (network === 'ropsten') {
    return `https://ropsten.etherscan.io/tx/${txHash}`;
  }

  return `https://etherscan.io/tx/${txHash}`;
};

export const EventNames = {
  LogNewBill: 'New Bill',
  LogSharePaid: 'Share Paid',
  LogFundsReleased: 'Funds Released',
};

// if there is an optional button it should be placed last in the array
export const Links = [
  {
    text: 'How it works',
    linkTo: '/',
  },
  {
    text: 'Transactions',
    linkTo: '/transactions',
  },
  {
    text: 'Pay a bill',
    linkTo: '/paybills',
  },
  {
    text: 'Create new',
    linkTo: '/create-new',
    optional: true,
  },
];
