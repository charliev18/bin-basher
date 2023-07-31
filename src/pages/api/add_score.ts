import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    let username;
    let score;

    try {
        username = request.body.username as string;
        score = request.body.score as number;
        if ( !username ) throw new Error('Valid username required');
        await sql`INSERT INTO Scores ( user_name, score ) VALUES (${username}, ${score});`;
    } catch (error) {
        return response.status(500).json({ error });
    }

    return response.status(200).json({  });
}
