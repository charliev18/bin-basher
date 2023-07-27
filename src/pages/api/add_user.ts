import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    try {
        const username = request.body.username as string;
        if ( !username ) throw new Error('Valid username required');
        await sql`INSERT INTO Users ( Name ) VALUES (${username});`;
    } catch (error) {
        return response.status(500).json({ error });
    }
    
    return response.status(200).json({});
}
