import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const scores = await sql`SELECT user_name, score, time FROM Scores ORDER BY user_name, time;`;
    return response.status(200).json( scores.rows );
}
