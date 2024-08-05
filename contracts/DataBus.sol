// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DataBus {
    event Message(
        bytes32 indexed eventId,
        address indexed sender,
        bytes data
    ) anonymous;

    function sendMessage(bytes32 _eventId, bytes calldata _data) public {
        emit Message(_eventId, msg.sender, _data);
    }
}
