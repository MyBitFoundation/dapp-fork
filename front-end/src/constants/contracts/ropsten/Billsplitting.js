export const ADDRESS = "0x06764fb047c0b006019f6bec8b76e85b870f8f8d"
export const ABI = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "_billID",
				"type": "bytes32"
			}
		],
		"name": "getTotalOwing",
		"outputs": [
			{
				"name": "owe",
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
		"name": "expired",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "database",
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
		"inputs": [],
		"name": "mybFee",
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
		"constant": false,
		"inputs": [
			{
				"name": "_receiver",
				"type": "address"
			},
			{
				"name": "_total",
				"type": "uint256"
			},
			{
				"name": "_payers",
				"type": "address[]"
			}
		],
		"name": "createBillEqual",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_billID",
				"type": "bytes32"
			}
		],
		"name": "releaseFunds",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_billID",
				"type": "bytes32"
			}
		],
		"name": "listPayers",
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
				"name": "_billID",
				"type": "bytes32"
			},
			{
				"name": "_newAddress",
				"type": "address"
			}
		],
		"name": "changeUserAddress",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_billID",
				"type": "bytes32"
			}
		],
		"name": "payShare",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_billID",
				"type": "bytes32"
			}
		],
		"name": "getUserOwing",
		"outputs": [
			{
				"name": "owe",
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
		"name": "mybBurner",
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
		"inputs": [
			{
				"name": "_database",
				"type": "address"
			},
			{
				"name": "_mybTokenBurner",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_billID",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "_receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_total",
				"type": "uint256"
			}
		],
		"name": "LogNewBill",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_oldAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_newAddress",
				"type": "address"
			}
		],
		"name": "LogAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_address",
				"type": "address"
			}
		],
		"name": "LogAddress",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_billID",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "_payer",
				"type": "address"
			}
		],
		"name": "LogSharePaid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_billID",
				"type": "bytes32"
			}
		],
		"name": "LogFundsReleased",
		"type": "event"
	}
];