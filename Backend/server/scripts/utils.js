// Libreria per interagire con la blockchain
import { Web3 } from 'web3';
// Libreria per leggere file
import fs from 'fs';
// Libreria per upload del file
import multer from 'multer';
// Libreria per la gestione del tempo
import moment from 'moment';

import axios from 'axios';
import https from 'https'; 



export const getWeb3 = () => {
  const hardhat_RPC_server_address = "http://127.0.0.1:8545";
  const web3 = new Web3(hardhat_RPC_server_address);
  return web3;
};

export const getContract = async (web3) => {
  const abi_url = "./server/contracts/ViaggiAutisti.json";
  const data = JSON.parse(fs.readFileSync(abi_url, 'utf8'));
  const abi = data.abi;
  const indirizzo_contratto = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const reg_aut = new web3.eth.Contract(abi, indirizzo_contratto);
  return reg_aut;
};

export const configureUpload = () => {
  const uploadDirectory = './server/temp_uploads/';
  if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory);
  }
  
  const upload = multer({ dest: './server/temp_uploads/' });

  return upload;
};





