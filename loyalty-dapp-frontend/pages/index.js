import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x14fB0033425d7f8f772c4dB179E57e03fF3BdB54';

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function mintPoints(address to, uint256 amount) external",
  "function burnPoints(address from, uint256 amount) external"
];

const ADMIN_ADDRESS = '0x5A9BD73AA4792607773942A60317e8D547eb20C5'.toLowerCase();

export default function Home() {
  const { address, isConnected } = useAccount();
  const [tokenBalance, setTokenBalance] = useState("0");
  const [mintAmount, setMintAmount] = useState("");
  const [mintTo, setMintTo] = useState("");
  const [redeemAmount, setRedeemAmount] = useState("");
  const [contract, setContract] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [txHistory, setTxHistory] = useState([]);

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    provider.getSigner().then(signer => {
      const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(tokenContract);
    });
  }, [isConnected]);

  const fetchBalance = async () => {
    if (contract && address) {
      const balance = await contract.balanceOf(address);
      setTokenBalance(ethers.formatUnits(balance, 18));
    }
  };

  const fetchTxHistory = async () => {
    if (!address) return;
    const API_KEY = 'SJJ539C2HK8ZG3K5NXK5UJSF6JJCJI4MV1';
    const contractAddress = CONTRACT_ADDRESS.toLowerCase();
    try {
      const res = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&sort=desc&apikey=${API_KEY}`);
      const data = await res.json();
      if (data.status === "1") {
        setTxHistory(data.result.slice(0, 5));
      } else {
        console.error("Etherscan error:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch transaction history", err);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTxHistory();
  }, [contract, address]);

  const handleAdminMint = async () => {
    if (!contract || !mintAmount || !mintTo) return;
    try {
      const tx = await contract.mintPoints(mintTo, ethers.parseUnits(mintAmount, 18));
      await tx.wait();
      alert("✅ Points minted to " + mintTo);
      await fetchBalance();
      await fetchTxHistory();
    } catch (err) {
      console.error(err);
      alert("❌ Minting failed");
    }
  };

  const handleRedeem = async () => {
    if (!contract || !redeemAmount) return;
    try {
      const tx = await contract.burnPoints(address, ethers.parseUnits(redeemAmount, 18));
      await tx.wait();
      alert("🔥 Points redeemed!");
      await fetchBalance();
      await fetchTxHistory();
    } catch (err) {
      console.error(err);
      alert("❌ Redeem failed");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="p-8 font-sans text-lg min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="text-center flex flex-col items-center space-y-3">
        <h1 className="text-4xl font-bold">🎁 Brand Loyalty DApp</h1>
        <p className="text-gray-300 text-sm">Reward your customers, the Web3 way</p>
        <ConnectButton />
      </div>

      {isConnected && (
        <div className="mt-6 p-4 bg-white text-black rounded shadow-md w-full max-w-2xl mx-auto">
          <p><strong>Wallet:</strong> {address}</p>
          <p className="mt-2"><strong>Balance:</strong> {tokenBalance} BPNT</p>

          <div className="mt-4">
            <input type="number" placeholder="Amount to redeem" value={redeemAmount} onChange={(e) => setRedeemAmount(e.target.value)} className="border px-3 py-1 rounded mr-2" />
            <button onClick={handleRedeem} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">Redeem Points</button>
          </div>

          {isAdmin && (
            <div className="mt-8 border-t pt-4">
              <h2 className="font-semibold text-lg mb-2">👑 Admin Mint</h2>
              <input type="text" placeholder="Recipient wallet" value={mintTo} onChange={(e) => setMintTo(e.target.value)} className="border px-3 py-1 rounded mb-2 w-full" />
              <input type="number" placeholder="Amount to mint" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} className="border px-3 py-1 rounded mr-2" />
              <button onClick={handleAdminMint} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Mint to Wallet</button>
            </div>
          )}

          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">🧾 Transaction History</h2>
            {txHistory.length === 0 ? <p>No recent transactions</p> : (
              <ul className="text-sm">
                {txHistory.map((tx) => (
                  <li key={tx.hash} className="mb-2 border-b pb-2">
                    <p><strong>From:</strong> {tx.from.slice(0, 6)}...{tx.from.slice(-4)}</p>
                    <p><strong>To:</strong> {tx.to.slice(0, 6)}...{tx.to.slice(-4)}</p>
                    <p><strong>Amount:</strong> {ethers.formatUnits(tx.value, 18)} BPNT</p>
                    <p><strong>Hash:</strong> <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{tx.hash.slice(0, 12)}...</a></p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">🎁 Reward Store</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow border">
                <h3 className="text-lg font-semibold">☕ Coffee Voucher</h3>
                <p className="text-gray-600">Redeem for a ₹100 Coffee Voucher</p>
                <p className="mt-2 font-bold text-purple-700">Cost: 50 BPNT</p>
                <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50" disabled={parseFloat(tokenBalance) < 50} onClick={async () => {
                  try {
                    const tx = await contract.burnPoints(address, ethers.parseUnits("50", 18));
                    await tx.wait();
                    await fetchBalance();
                    await fetchTxHistory();
                    alert("🎉 You've redeemed 1 Coffee Voucher!");
                  } catch (err) {
                    console.error(err);
                    alert("❌ Redeem failed");
                  }
                }}>Redeem</button>
              </div>

              <div className="bg-white p-4 rounded shadow border">
                <h3 className="text-lg font-semibold">👕 Brand T-Shirt</h3>
                <p className="text-gray-600">Cool swag with our logo</p>
                <p className="mt-2 font-bold text-blue-700">Cost: 150 BPNT</p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50" disabled={parseFloat(tokenBalance) < 150} onClick={async () => {
                  try {
                    const tx = await contract.burnPoints(address, ethers.parseUnits("150", 18));
                    await tx.wait();
                    await fetchBalance();
                    await fetchTxHistory();
                    alert("🎉 You've redeemed 1 Brand T-Shirt!");
                  } catch (err) {
                    console.error(err);
                    alert("❌ Redeem failed");
                  }
                }}>Redeem</button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}