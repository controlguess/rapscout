export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;

    if (!id || isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID provided' });
    }

    try {
        const response = await fetch("https://hexagon.pw/api/avatarthumbnail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                assetid: parseInt(id),
                type: "headshot",
                asset: "user"
            })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch headshot data from Hexagon API");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error("Failed to retrieve valid headshot data");
        }

        res.status(200).json({
            success: true,
            message: "",
            data: {
                url: data.data.url,
                status: data.data.status
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
