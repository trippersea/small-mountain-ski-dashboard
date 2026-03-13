/**
 * /api/conditions — currently disabled
 *
 * Live resort conditions are temporarily turned off while the data pipeline is
 * being rebuilt for consistency and reliability.
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  return res.status(200).json({
    conditions: null,
    disabled: true,
    message: 'Live conditions are temporarily turned off while the data pipeline is rebuilt.',
  });
};
