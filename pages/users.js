import { useState } from "react";

export default function Users() {
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!userId || isNaN(userId)) {
            setError("Please enter a valid User ID.");
            return;
        }

        setLoading(true);
        setError("");
        setUserData(null);
        setInventory([]);

        try {
            const headshotRes = await fetch(`/api/getheadshot?id=${userId}`);
            if (!headshotRes.ok) {
                throw new Error("Failed to fetch user headshot.");
            }
            const headshotUrl = headshotRes.url;

            const inventoryRes = await fetch("https://hexagon.pw/api/users/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid: userId, page: 1 }),
            });

            if (!inventoryRes.ok) {
                throw new Error("Failed to fetch user inventory.");
            }

            const inventoryData = await inventoryRes.json();

            if (inventoryData.success) {
                const limitedItems = inventoryData.data.inventory.filter(
                    (item) => item.limited || item.limited === "limitedu"
                );
                setUserData({
                    headshotUrl,
                    username: inventoryData.data.username,
                });
                setInventory(limitedItems);
            } else {
                setError("No inventory found for this user.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <div className="header-container mb-4">
                <img src="/assets/headerlongtext.png" alt="Header" className="max-w-full" />
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md"
                />
                <button
                    onClick={handleSearch}
                    className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md"
                >
                    Search
                </button>
            </div>

            {loading && <p className="text-center text-gray-400">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {userData && (
                <div className="user-profile mb-6 flex items-center">
                    <img
                        src={userData.headshotUrl}
                        alt="User Headshot"
                        className="w-32 h-32 rounded-full object-cover mr-4"
                    />

                    <div>
                        <h2 className="text-xl font-semibold">{userData.username}</h2>
                    </div>
                </div>
            )}

            {inventory.length > 0 && (
                <div className="grid-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {inventory.map((item) => (
                        <div key={item.assetid} className="card bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-center text-lg font-semibold">{item.assetname}</h3>
                            <img
                                src={`https://hexagon.pw/Thumbs/Asset.ashx?assetId=${item.assetid}`}
                                alt={item.assetname}
                                className="w-full h-48 object-cover mt-3 rounded-lg"
                            />

                            {item.limited && (
                                <p className="mt-2 text-gray-300">Serial: {item.serialid}</p>
                            )}

                            <a
                                href={`https://hexagon.pw/catalog/${item.assetid}`}
                                className="block text-center text-blue-400 hover:text-blue-500 mt-3 font-semibold"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                🔗 View on Hexagon
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
