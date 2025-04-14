import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractJson from "../artifacts/contracts/WaterBill.sol/WaterBill.json";
import '../App.css';

const contractAddress = "0x4B92F9f60C4269F99eEC4E6890fc1b91258Cc5ce";
const contractABI = contractJson.abi;

const UserPage = () => {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [billAmount, setBillAmount] = useState("");
    const [userBill, setUserBill] = useState(null);

    useEffect(() => {
        connectWallet();
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                setAccount(userAddress);
                const waterBillContract = new ethers.Contract(contractAddress, contractABI, signer);
                setContract(waterBillContract);
                fetchBill(waterBillContract);
            } catch (err) {
                console.error("Wallet connection failed", err);
            }
        } else {
            alert("Please install MetaMask.");
        }
    };

    const payBill = async () => {
        if (!contract) return alert("Connect to wallet first!");
        try {
            const tx = await contract.payBill({ value: ethers.parseEther(billAmount) });
            await tx.wait();
            alert("Bill paid!");
            fetchBill(contract);
        } catch (err) {
            console.error(err);
            alert("Payment failed.");
        }
    };

    const fetchBill = async (instance = contract) => {
        if (!instance) return;
        try {
            const bill = await instance.getMyBill();
            setUserBill({
                amount: ethers.formatEther(bill[0]),
                paid: bill[1],
            });
        } catch (err) {
            console.error(err);
            alert("Could not fetch your bill.");
        }
    };

    return (
        <div className="container">
            <h2>💧 User - Pay Water Bill</h2>
            <p><strong>Connected Account:</strong> {account}</p>

            <input
                type="number"
                placeholder="Amount to pay (ETH)"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
            />
            <button onClick={payBill} className="button">Pay Bill</button>

            <div className="section">
                <h3>📜 Your Bill Info</h3>
                <button onClick={() => fetchBill()} className="button">Refresh</button>
                {userBill && (
                    <p>
                        <strong>Amount:</strong> {userBill.amount} ETH<br />
                        <strong>Status:</strong> {userBill.paid ? "✅ Paid" : "❌ Unpaid"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserPage;
