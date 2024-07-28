import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  if (!ethereum) {
    throw new Error("MetaMask not detected. Please install MetaMask.");
  }
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [connectedAccount, setConnectedAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
  const [loadingWallet, setLoadingWallet] = useState(false); // Add loading state

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask.");
      }
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setConnectedAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to wallet.");
    }
  };

  const connectWallet = async () => {
    setLoadingWallet(true); // Start loading
    const startTime = Date.now();
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask.");
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setConnectedAccount(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to MetaMask.");
    } finally {
      setLoadingWallet(false); // End loading
      const endTime = Date.now();
      console.log(`Wallet connection took ${(endTime - startTime) / 1000} seconds.`);
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask.");
      }

      setIsLoading(true);

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      const tx = await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: connectedAccount,
          to: addressTo,
          gas: "0x5208",
          value: parsedAmount.toHexString(),
        }],
      });

      const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);

      const transactionsCount = await transactionContract.getTransactionCount();

      setTransactionCount(transactionsCount.toNumber());
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider value={{
      connectedAccount,
      connectWallet,
      sendTransaction,
      handleChange,
      formData,
      isLoading,
      transactionCount,
      loadingWallet // Add loading state to context
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
