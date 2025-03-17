export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userid } = req.body;

    if (!userid || isNaN(userid)) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }

    try {
        const response = await fetch('https://hexagon.pw/api/users/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: parseInt(userid),
                page: 1,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch inventory data from Hexagon API');
        }

        const data = await response.json();

        if (data.success) {
            res.status(200).json(data.data);
        } else {
            res.status(404).json({ error: 'No inventory found for this user.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
