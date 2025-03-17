export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const response = await fetch("https://hexagon.pw/api/catalog/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ collectableFilter: true })
        });

        if (!response.ok) throw new Error("Failed to fetch catalog data");

        const data = await response.json();

        if (!data.success || !data.data.items) throw new Error("Invalid response format");

        const sortedItems = data.data.items
            .filter(item => item.recentaverageprice !== undefined) // Remove undefined avg price
            .sort((a, b) => a.recentaverageprice - b.recentaverageprice);

        res.status(200).json(sortedItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}