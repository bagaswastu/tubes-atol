import { NextApiRequest, NextApiResponse } from 'next';
import { getSnap } from '../../lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const id = req.query.id as string;

    let snap = await getSnap(id);

    // validation
    if (snap.image === undefined) {
      return res.status(404).json({
        message: 'Snap not found',
      });
    }

    res.status(200).json(snap);
  }

  return res.status(405).end();
}
