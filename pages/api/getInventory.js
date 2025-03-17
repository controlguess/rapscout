export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userid } = req.body;

    if (!userid || isNaN(userid)) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }

    let fullInventory = [];
    let currentPage = 1;
    let nextPageCursor = null;

    try {

        do {
            const response = await fetch('https://hexagon.pw/api/users/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: parseInt(userid),
                    page: currentPage,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch inventory data from Hexagon API');
            }

            const data = await response.json();

            if (data.success && data.data.inventory) {
                fullInventory = [...fullInventory, ...data.data.inventory]; 
            } else {
                break; 
            }

            nextPageCursor = data.data.nextPageCursor;

            currentPage++;

        } while (nextPageCursor && !isNaN(nextPageCursor));

        if (fullInventory.length > 0) {
            res.status(200).json({ inventory: fullInventory });
        } else {
            res.status(404).json({ error: 'No inventory found for this user.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
