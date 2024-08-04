// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataBus {
    event Message(
        uint256 indexed messageType,
        uint256 indexed encodingVersion,
        address indexed sender,
        bytes data
    );

    function sendMessage(uint256 _messageType, uint256 _encodingVersion, bytes memory _data) public {
        emit Message(_messageType, _encodingVersion, msg.sender, _data);
    }
}
