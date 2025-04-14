import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractJson from "../artifacts/contracts/WaterBill.sol/WaterBill.json";
import '../App.css';

const contractAddress = "0x4B92F9f60C4269F99eEC4E6890fc1b91258Cc5ce";
const contractABI = contractJson.abi;

const AdminPage = () => {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [billAmount, setBillAmount] = useState("");

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
            } catch (err) {
                console.error("Wallet connection failed", err);
            }
        } else {
            alert("Please install MetaMask.");
        }
    };

    const generateBill = async () => {
        if (!contract) return alert("Connect to wallet first!");
        try {
            const tx = await contract.generateBill(ethers.parseEther(billAmount));
            await tx.wait();
            alert("Bill generated!");
        } catch (err) {
            console.error(err);
            alert("Error generating bill.");
        }
    };

    return (
        <div className="container">
            <h2>🛠 Admin Panel - Generate Bill</h2>
            <p><strong>Admin:</strong> {account}</p>
            <input
                type="number"
                placeholder="Bill Amount in ETH"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
            />
            <button onClick={generateBill} className="button">Generate Bill</button>
        </div>
    );
};

export default AdminPage;
