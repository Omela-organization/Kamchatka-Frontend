import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch('http://194.113.35.2:8000/api/v1/territories/');
  const data = await response.json();

  res.status(200).json(data);
}
