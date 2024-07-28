import React, { useContext } from 'react';
import { SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';
import { TransactionContext } from '../context/TransactionContext';

const Welcome = () => {
    const { connectedAccount, connectWallet, loadingWallet } = useContext(TransactionContext);

    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start flex-col">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                        Send Crypto <br /> across the world
                    </h1>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Explore the crypto world. Buy and sell cryptocurrencies easily on crypto.
                    </p>
                    {!connectedAccount && (
                        <button
                            type="button"
                            onClick={connectWallet}
                            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                            disabled={loadingWallet} // Disable button while loading
                        >
                            {loadingWallet ? (
                                <p className="text-white text-base font-semibold">Connecting...</p>
                            ) : (
                                <p className="text-white text-base font-semibold">Connect Wallet</p>
                            )}
                        </button>
                    )}
                </div>

                <div className="flex flex-col flex-1 items-center justify-start w-full mt-10">
                    <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                    <SiEthereum fontSize={21} color="#fff" />
                                </div>
                                <BsInfoCircle fontSize={17} color="#fff" />
                            </div>
                            <div>
                                <p className="text-white font-light text-sm">Address</p>
                                <p className="text-white font-semibold text-lg mt-1">{connectedAccount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
