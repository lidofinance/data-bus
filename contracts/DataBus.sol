// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title A contract for sending and logging messages as an abstract data bus
/// @notice This smart contract serves as an abstract data bus, which can be utilized to facilitate lightweight, inter-service communication.
/// @dev The contract uses an anonymous event to broadcast messages with minimalistic implementation and low gas consumption. It does not require support and administration.
contract DataBus {
    /// @notice Emitted when a message is sent through the data bus
    /// @param eventId An arbitrary set of bytes that can encode the name and version; it serves as the unique identifier for each event
    /// @param sender The address of the transaction initiator; it is expected that the receiving side will filter based on known senders without explicit authorization
    /// @param data Arbitrary data encoded as bytes, representing the payload of the message
    event Message(
        bytes32 indexed eventId,
        address indexed sender,
        bytes data
    ) anonymous;

    /// @notice Sends a message with the specified `eventId` and `data`
    /// @dev Emits the `anonymous` event containing the message details; this method can be called by any sender to broadcast information
    /// @param _eventId The unique identifier for the message event
    /// @param _data The payload of the message to be sent
    function sendMessage(bytes32 _eventId, bytes calldata _data) external {
        emit Message(_eventId, msg.sender, _data);
    }
}
