import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import contractJson from "../artifacts/contracts/WaterBill.sol/WaterBill.json";
import '../App.css';

const contractAddress = "0xf8FC80E9639306E03DAf03d6723c7DB33ea4d283";
const contractABI = contractJson.abi;

const AdminPage = () => {
    const [account, setAccount] = useState("");
    const [billAmount, setBillAmount] = useState("");
    const [contract, setContract] = useState(null);
    const backgroundRef = useRef(null);
    const vantaEffectRef = useRef(null);

    useEffect(() => {
        connectWallet();

        if (!vantaEffectRef.current && window.VANTA && window.VANTA.NET && backgroundRef.current) {
            vantaEffectRef.current = window.VANTA.NET({
                el: backgroundRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0x00bcd4,
                backgroundColor: 0xe0f7fa,
                points: 10.0,
                maxDistance: 25.0,
                spacing: 18.0
            });
        }

        return () => {
            if (vantaEffectRef.current) {
                vantaEffectRef.current.destroy();
                vantaEffectRef.current = null;
            }
        };
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const addr = await signer.getAddress();
            setAccount(addr);
            const waterBillContract = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(waterBillContract);
        } else {
            alert("MetaMask not detected.");
        }
    };

    const generateBill = async () => {
        if (!contract || !billAmount) return;

        try {
            const tx = await contract.generateBill(ethers.parseEther(billAmount));
            await tx.wait();
            alert("✅ Bill generated for current wallet.");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to generate bill.");
        }
    };

    return (
        <div ref={backgroundRef} className="homepage-container">
            <div className="content-container loaded">
                <h2>Admin Panel - Self Bill Generation</h2>
                <p><strong>Wallet:</strong> {account}</p>
                <input
                    type="number"
                    placeholder="Bill Amount in ETH"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                />
                <button onClick={generateBill} className="button">Generate My Bill</button>
                <div className="powered-by">
          Powered by Ethereum Blockchain
        </div>
            </div>
            
        </div>
    );
};

export default AdminPage;
