window.config = {
    provider: 'http://localhost:8545'
};

window.contracts = {
    token: {
        'abi': [
            {
                'constant': false,
                'inputs': [],
                'name': 'hello',
                'outputs': [
                    {
                        'internalType': 'string',
                        'name': 'x',
                        'type': 'string'
                    }
                ],
                'payable': false,
                'stateMutability': 'nonpayable',
                'type': 'function'
            }
        ],
        address: '0x74CE6aBdfBB861cb01b90Eb622162B5E2c3ED091'
    },
    marketplace: {
        abi: [],
        address: '0x9'
    }
};
