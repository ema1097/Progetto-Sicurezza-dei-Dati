// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ViaggiAutisti is AccessControl {
    bytes32 public constant VOTER_ROLE = keccak256("DRIVER_ROLE");

    constructor (){
        //msg.sender = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

}