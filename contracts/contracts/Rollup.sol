// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Rollup {
    uint a = 1;
    uint b = 5;
    uint c = 6;

    uint public currentBatchId = 0;

    event BatchSubmitted(
        uint indexed batchId,
        bytes[] indexed _input,
        bytes[] indexed _signatures
    );

    struct L1State {
        uint x;
        uint y;
    }

    struct BatchInfo {
        uint blockNumber;
        address proposer;
    }

    mapping(uint => L1State) batchToState;
    mapping(uint => BatchInfo) batchInfo;

    L1State finalState = L1State({x: 0, y: 0});
    L1State latestState = L1State({x: 0, y: 0});

    function submitBatch(
        bytes[] calldata _input,
        bytes[] calldata _signatures
    ) external {
        currentBatchId++;

        // just setting the last element of the inputs as final state
        (, uint _x, uint _y) = abi.decode(
            _input[_input.length - 1],
            (address, uint, uint)
        );

        latestState.x = _x;
        latestState.y = _y;

        batchInfo[currentBatchId] = BatchInfo({
            blockNumber: block.number,
            proposer: msg.sender
        });
        batchToState[currentBatchId] = latestState;

        emit BatchSubmitted(currentBatchId, _input, _signatures);
    }

    function verifyBatch(
        bytes[] calldata _input,
        bytes[] calldata _signatures
    ) public view returns (bool validBatch) {
        for (uint i = 0; i < _input.length; i++) {
            (address signer, uint x, uint y) = abi.decode(
                _input[i],
                (address, uint, uint)
            );

            bool valid = ECDSA.recover(
                ECDSA.toEthSignedMessageHash(_input[i]),
                _signatures[i]
            ) == signer;

            if (!valid) {
                return false;
            }

            if (!isValidStateTransition(x, y)) {
                return false;
            }
        }

        return true;
    }

    function finalizeBatch() external {
        require(
            block.number > batchInfo[currentBatchId].blockNumber + 10,
            "fraud_window_active"
        );

        finalState = batchToState[currentBatchId];
        latestState = L1State(0, 0);
    }

    function rollback(
        bytes[] calldata _input,
        bytes[] calldata _signatures
    ) external {
        require(!verifyBatch(_input, _signatures), "state_transition_is_valid");

        // slash the proposer of the batch
        // address proposer = batchInfo[currentBatchId].proposer

        delete batchToState[currentBatchId];
        delete batchInfo[currentBatchId];

        currentBatchId--;

        finalState = batchToState[currentBatchId];
        latestState = L1State(0, 0);
    }

    function isValidStateTransition(
        uint _y,
        uint _x
    ) internal view returns (bool) {
        uint expected = stateTransition(_x);
        return expected == _y;
    }

    function stateTransition(uint _x) internal view returns (uint) {
        // y = x^2 - 5x + 6 OR (x-2)(x-3)
        // breaks for values of x between (2,3)
        // as output is uint
        return (a * _x ** 2) - (b * _x) + 6;
    }
}
