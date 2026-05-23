// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// @notice This is an unaudited educational contract built for Monad testnet.
// Do not use in production without a formal security audit.

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GmonadWall
 * @notice A simple on-chain message wall for the Monad community.
 */
contract GmonadWall is Ownable {

    struct Message {
        address author;
        string text;
        uint256 timestamp;
        bool hidden;
    }

    uint256 public constant MAX_READ = 50;
    uint256 public constant COOLDOWN = 5 minutes;
    uint256 public constant MAX_LENGTH = 120;

    Message[] private messages;
    mapping(address => uint256) private lastPosted;

    event MessagePosted(uint256 indexed id, address indexed author, uint256 timestamp);
    event MessageHidden(uint256 indexed id, bool hidden);

    constructor() Ownable(msg.sender) {}

    function postMessage(string calldata text) external {
        require(bytes(text).length > 0, "Empty message");
        require(bytes(text).length <= MAX_LENGTH, "Message too long");
        require(
            block.timestamp >= lastPosted[msg.sender] + COOLDOWN,
            "Cooldown active"
        );

        messages.push(Message({
            author: msg.sender,
            text: text,
            timestamp: block.timestamp,
            hidden: false
        }));

        lastPosted[msg.sender] = block.timestamp;
        emit MessagePosted(messages.length - 1, msg.sender, block.timestamp);
    }

    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }

    function getLatestMessages(uint256 limit) external view returns (
        uint256[] memory ids,
        string[] memory texts,
        uint256[] memory timestamps,
        bool[] memory hiddenFlags
    ) {
        uint256 safeLimit = limit > MAX_READ ? MAX_READ : limit;
        uint256 total = messages.length;
        uint256 count = safeLimit < total ? safeLimit : total;

        ids         = new uint256[](count);
        texts       = new string[](count);
        timestamps  = new uint256[](count);
        hiddenFlags = new bool[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 idx = total - count + i;
            ids[i]         = idx;
            texts[i]       = messages[idx].text;
            timestamps[i]  = messages[idx].timestamp;
            hiddenFlags[i] = messages[idx].hidden;
        }
    }

    function getCooldownRemaining(address user) external view returns (uint256) {
        uint256 nextAllowed = lastPosted[user] + COOLDOWN;
        if (block.timestamp >= nextAllowed) return 0;
        return nextAllowed - block.timestamp;
    }

    function hideMessage(uint256 id, bool hidden) external onlyOwner {
        require(id < messages.length, "Invalid id");
        messages[id].hidden = hidden;
        emit MessageHidden(id, hidden);
    }
}