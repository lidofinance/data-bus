// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DSMDataBus
 * @dev A contract to manage and emit various messages related to staking modules and guardian operations.
 */
contract DSMDataBus {
    /**
     * @dev Enum representing the type of messages.
     */
    enum MessageType {
        PAUSE,
        DEPOSIT,
        UNVET,
        PING
    }

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
        uint guardianIndex;
        string depositRoot;
        uint nonce;
        uint blockNumber;
        bytes32 blockHash;
        bytes signature;
        uint stakingModuleId;
        AppMetaData appMeta;
    }

    /**
     * @dev Struct containing data related to version 2 of the pause functionality.
     */
    struct PauseV2Data {
        uint guardianIndex;
        string depositRoot;
        uint nonce;
        uint blockNumber;
        bytes32 blockHash;
        bytes signature;
        uint stakingModuleId;
        AppMetaData appMeta;
    }

    /**
     * @dev Struct containing data related to version 3 of the pause functionality.
     */
    struct PauseV3Data {
        uint guardianIndex;
        uint blockNumber;
        bytes signature;
        AppMetaData appMeta;
    }

    /**
     * @dev Struct containing data related to unvetted operations.
     */
    struct UnvetData {
        uint guardianIndex;
        uint nonce;
        uint blockNumber;
        bytes32 blockHash;
        uint stakingModuleId;
        bytes signature;
        string operatorIds;
        string vettedKeysByOperator;
        AppMetaData appMeta;
    }

    /**
     * @dev Emitted when a deposit message is sent.
     */
    event MessageDeposit(
        MessageType indexed messageType,
        address indexed guardianAddress,
        DepositData data
    );

    /**
     * @dev Emitted when a pause message (version 2) is sent.
     */
    event MessagePauseV2(
        MessageType indexed messageType,
        address indexed guardianAddress,
        PauseV2Data data
    );

    /**
     * @dev Emitted when a pause message (version 3) is sent.
     */
    event MessagePauseV3(
        MessageType indexed messageType,
        address indexed guardianAddress,
        PauseV3Data data
    );

    /**
     * @dev Emitted when an unvet message is sent.
     */
    event MessageUnvet(
        MessageType indexed messageType,
        address indexed guardianAddress,
        UnvetData data
    );

    /**
     * @dev Emitted when a ping message is sent.
     */
    event MessagePing(
        MessageType indexed messageType,
        address indexed guardianAddress,
        AppMetaData data
    );

    /**
     * @dev Sends a ping message.
     * @param _appMeta The metadata of the application.
     */
    function sendPingMessage(AppMetaData calldata _appMeta) public {
        require(bytes(_appMeta.version).length > 0, "Version must not be empty");
        require(bytes(_appMeta.name).length > 0, "Name must not be empty");
        
        emit MessagePing(MessageType.PING, msg.sender, _appMeta);
    }

    /**
     * @dev Sends a deposit message.
     * @param _depositData The data related to the deposit.
     */
    function sendDepositMessage(DepositData calldata _depositData) public {
        require(_depositData.guardianIndex > 0, "Invalid guardian index");
        require(bytes(_depositData.depositRoot).length > 0, "Deposit root must not be empty");
        require(_depositData.blockNumber > 0, "Invalid block number");
        require(_depositData.blockHash != bytes32(0), "Invalid block hash");
        require(_depositData.signature.length > 0, "Signature must not be empty");

        emit MessageDeposit(MessageType.DEPOSIT, msg.sender, _depositData);
    }

    /**
     * @dev Sends an unvet message.
     * @param _unvetData The data related to the unvet operation.
     */
    function sendUnvetMessage(UnvetData calldata _unvetData) public {
        require(_unvetData.guardianIndex > 0, "Invalid guardian index");
        require(_unvetData.nonce > 0, "Invalid nonce");
        require(_unvetData.blockNumber > 0, "Invalid block number");
        require(_unvetData.blockHash != bytes32(0), "Invalid block hash");
        require(_unvetData.signature.length > 0, "Signature must not be empty");
        require(bytes(_unvetData.operatorIds).length > 0, "Operator IDs must not be empty");
        require(bytes(_unvetData.vettedKeysByOperator).length > 0, "Vetted keys must not be empty");

        emit MessageUnvet(MessageType.UNVET, msg.sender, _unvetData);
    }

    /**
     * @dev Sends a pause message (version 2).
     * @param _pauseV2Data The data related to the pause operation (version 2).
     */
     function sendPauseMessageV2(PauseV2Data calldata _pauseV2Data) public {
        require(_pauseV2Data.guardianIndex > 0, "Invalid guardian index");
        require(bytes(_pauseV2Data.depositRoot).length > 0, "Deposit root must not be empty");
        require(_pauseV2Data.nonce > 0, "Invalid nonce");
        require(_pauseV2Data.blockNumber > 0, "Invalid block number");
        require(_pauseV2Data.blockHash != bytes32(0), "Invalid block hash");
        require(_pauseV2Data.signature.length > 0, "Signature must not be empty");

        emit MessagePauseV2(MessageType.PAUSE, msg.sender, _pauseV2Data);
    }

    /**
     * @dev Sends a pause message (version 3).
     * @param _pauseV3Data The data related to the pause operation (version 3).
     */
    function sendPauseMessageV3(PauseV3Data calldata _pauseV3Data) public {
        require(_pauseV3Data.guardianIndex > 0, "Invalid guardian index");
        require(_pauseV3Data.blockNumber > 0, "Invalid block number");
        require(_pauseV3Data.signature.length > 0, "Signature must not be empty");

        emit MessagePauseV3(MessageType.PAUSE, msg.sender, _pauseV3Data);
    }
}
