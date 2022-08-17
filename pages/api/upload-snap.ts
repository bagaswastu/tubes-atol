import { NextApiRequest, NextApiResponse } from 'next';
import { Snap, uploadSnap } from '../../lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const snap = JSON.parse(req.body) as Snap;

    // validation
    if (!snap.image || !snap.countdown) {
      return res.status(400).json({
        message: 'Invalid request body',
      });
    }

    let id = await uploadSnap(snap);

    return res.status(200).json({
      id,
    });
  }

  return res.status(405).end();
}
