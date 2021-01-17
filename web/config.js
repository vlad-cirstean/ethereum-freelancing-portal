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
        address: '0x9cfa40c23Ea750D3789F33516541115d8B0840a6'
    },
    marketplace: {
        abi: [],
        address: '0x9'
    }
};
