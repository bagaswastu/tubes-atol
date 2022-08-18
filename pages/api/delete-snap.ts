import { NextApiRequest, NextApiResponse } from 'next';
import { deleteSnap } from '../../lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const id = req.query.id as string;

    await deleteSnap(id);

    res.status(200).json({status: 'ok'});
  }

  return res.status(405).end();
}
