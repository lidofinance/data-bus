// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DSMDataBus is AccessControl {
    // Define the Guardian role
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

    // Contract events
    event Status(string message);
    event Deposit(address indexed from, uint amount);
    event Unvet(address indexed user);

    // Constructor for initializing the guardian list at deployment
    constructor(address[] memory initialGuardians) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // Assign the role administrator
        for (uint i = 0; i < initialGuardians.length; i++) {
            _grantRole(GUARDIAN_ROLE, initialGuardians[i]);
        }
    }

    // Modifier to check Guardian authorization
    modifier onlyGuardian() {
        require(hasRole(GUARDIAN_ROLE, msg.sender), "You are not a guardian");
        _;
    }

    // Function to add guardians
    function addGuardian(address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(GUARDIAN_ROLE, user);
    }

    // Function to remove guardians
    function removeGuardian(address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(GUARDIAN_ROLE, user);
    }

    // Function to emit a status message
    function sendStatusMessage(string memory newStatus) public onlyGuardian {
        emit Status(newStatus);
    }

    // Function to accept deposits and emit the corresponding event
    function sendDepositMessage() public payable onlyGuardian {
        emit Deposit(msg.sender, msg.value);
    }

    // Function to emit the Unvet event
    function sendUnvetMessage(address user) public onlyGuardian {
        emit Unvet(user);
    }
}
