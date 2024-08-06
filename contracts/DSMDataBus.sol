// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DSMDataBus
 * @dev A contract to manage and emit various messages related to staking modules and guardian operations.
 */
contract DSMDataBus {
    /**
     * @dev Struct containing metadata about the application.
     */
    struct AppMetaData {
        string version;
        string name;
    }

    /**
     * @dev Struct containing data related to deposits.
     */
    struct DepositData {
        int256 guardianIndex;
        bytes32 depositRoot;
        uint256 nonce;
        uint256 blockNumber;
        bytes32 blockHash;
        bytes signature;
        uint256 stakingModuleId;
        AppMetaData app;
    }

    /**
     * @dev Struct containing data related to version 2 of the pause functionality.
     */
    struct PauseV2Data {
        int256 guardianIndex;
        bytes32 depositRoot;
        uint256 nonce;
        uint256 blockNumber;
        bytes32 blockHash;
        bytes signature;
        uint256 stakingModuleId;
        AppMetaData app;
    }

    /**
     * @dev Struct containing data related to version 3 of the pause functionality.
     */
    struct PauseV3Data {
        int256 guardianIndex;
        uint256 blockNumber;
        bytes signature;
        AppMetaData app;
    }

    /**
     * @dev Struct containing data related to unvetted operations.
     */
    struct UnvetData {
        int256 guardianIndex;
        uint256 nonce;
        uint256 blockNumber;
        bytes32 blockHash;
        uint256 stakingModuleId;
        bytes signature;
        string operatorIds;
        string vettedKeysByOperator;
        AppMetaData app;
    }

    /**
     * @dev Struct containing data related to ping operations.
     */
    struct PingData {
        uint256 blockNumber;
        int256 guardianIndex;
        uint256[] stakingModuleIds;
        AppMetaData app;
    }

    /**
     * @dev Emitted when a deposit message is sent.
     */
    event MessageDeposit(
        address indexed guardianAddress,
        DepositData data
    );

    /**
     * @dev Emitted when a pause message (version 2) is sent.
     */
    event MessagePauseV2(
        address indexed guardianAddress,
        PauseV2Data data
    );

    /**
     * @dev Emitted when a pause message (version 3) is sent.
     */
    event MessagePauseV3(
        address indexed guardianAddress,
        PauseV3Data data
    );

    /**
     * @dev Emitted when an unvet message is sent.
     */
    event MessageUnvet(
        address indexed guardianAddress,
        UnvetData data
    );

    /**
     * @dev Emitted when a ping message is sent.
     */
    event MessagePing(
        address indexed guardianAddress,
        PingData data
    );
}
