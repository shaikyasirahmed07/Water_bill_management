import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import contractJson from "../artifacts/contracts/WaterBill.sol/WaterBill.json";
import '../App.css';

const contractAddress = "0xf8FC80E9639306E03DAf03d6723c7DB33ea4d283";
const contractABI = contractJson.abi;

const UserPage = () => {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [billAmount, setBillAmount] = useState("");
    const [userBill, setUserBill] = useState(null);
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
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
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

    const payBill = async () => {
        if (!contract) return alert("Connect to wallet first!");
        if (!userBill || userBill.amount === "0.0") {
            alert("No bill generated yet. Please contact admin.");
            return;
        }

        try {
            const tx = await contract.payBill({
                value: ethers.parseEther(billAmount)
            });
            await tx.wait();
            alert("✅ Bill paid!");
            fetchBill(contract);
        } catch (err) {
            console.error(err);
            alert("❌ Payment failed.");
        }
    };

    return (
        <div ref={backgroundRef} className="homepage-container">
            <div className="content-container loaded">
                <h2>💧 User - Pay Water Bill</h2>
                <p><strong>Connected Account:</strong> {account}</p>

                <input
                    type="number"
                    placeholder="Amount to pay (ETH)"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                />
                <button onClick={payBill} className="button" disabled={!userBill || userBill.amount === "0.0" || userBill.paid}>
                    Pay Bill
                </button>

                <div className="section">
                    <h3>📜 Your Bill Info</h3>
                    <button onClick={() => fetchBill()} className="button">Refresh</button>
                    {userBill ? (
                        <p>
                            <strong>Amount:</strong> {userBill.amount} ETH<br />
                            <strong>Status:</strong> {userBill.paid ? "✅ Paid" : "❌ Unpaid"}
                        </p>
                    ) : (
                        <p>No bill found. Please wait for admin to generate it.</p>
                    )}
                </div>
                <div className="powered-by">
          Powered by Ethereum Blockchain
        </div>
            </div>
            
        </div>
        
    );
};

export default UserPage;
