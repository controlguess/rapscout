import { useEffect, useState } from "react";

export default function Home() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [onsaleOnly, setOnsaleOnly] = useState(false);

    useEffect(() => {
        fetch("/api/catalog", { method: "POST" })
            .then(res => res.json())
            .then(data => {
                setItems(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (onsaleOnly) {
            setFilteredItems(items.filter(item => item.recentaverageprice && item.recentaverageprice >= 1));
        } else {
            setFilteredItems(items);
        }
    }, [onsaleOnly, items]);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <div className="header-container">
                <img src="/assets/headerlongtext.png" alt="Header" className="max-w-full" />
            </div>

            <div className="toggle-container">
                <label className="toggle-label">On Sale Only</label>
                <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={onsaleOnly} 
                    onChange={() => setOnsaleOnly(!onsaleOnly)} 
                />
                <div className={`w-10 h-5 flex items-center bg-gray-700 rounded-full p-1 transition duration-300 ${onsaleOnly ? 'bg-blue-500' : 'bg-gray-700'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${onsaleOnly ? 'translate-x-5' : ''}`}></div>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-400">Loading...</p>
            ) : (
                <div className="grid-container">
                    {filteredItems.map(item => (
                        <div key={item.assetid} className="card">
                            <h2 className="text-center text-lg font-semibold">{item.assetname}</h2>
                            <img 
                                src={`https://hexagon.pw/Thumbs/Asset.ashx?assetId=${item.assetid}`} 
                                alt={item.assetname} 
                                className="w-full h-48 object-cover mt-3 rounded-lg"
                            />
                            <p className="mt-2 text-gray-300">💰 Price: <span className="text-white">${item.price}</span></p>
                            <p className="text-gray-300">📈 Average: <span className="text-white">${item.recentaverageprice}</span></p>
                            <p className="text-gray-300">🏷️ Type: <span className="text-white">{item.limited}</span></p>
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