import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID provided' });
  }

  try {
    const response = await axios.post('https://hexagon.pw/api/avatarthumbnail', {
      assetid: parseInt(id),
      type: 'headshot',
      asset: 'user',
    });

    if (response.data.success) {
      return res.status(200).json({
        success: true,
        message: '',
        data: {
          url: response.data.data.url,
          status: response.data.data.status,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to get headshot',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching headshot',
    });
  }
}
