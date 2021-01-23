window.config = {
    provider: 'http://localhost:8545'
};

window.contracts = {
    marketplace: {
        abi: [
            {
                'inputs': [
                    {
                        'internalType': 'string',
                        'name': 'input',
                        'type': 'string'
                    }
                ],
                'name': 'echo',
                'outputs': [
                    {
                        'internalType': 'string',
                        'name': 'text',
                        'type': 'string'
                    }
                ],
                'stateMutability': 'nonpayable',
                'type': 'function'
            }
        ],
        address: '0xC53339b5aE716dc64946f961C1b6B47BbE027b9e'
    },
    token: { // should not be needed
    }
};
