import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    let resp;

    try {
        const username = request.query.username as string;
        if ( !username ) throw new Error('Valid username required');
        resp = await sql`SELECT * FROM Users WHERE Name=${username};`;
    } catch (error) {
        return response.status(500).json({ error });
    }
    
    return response.status(200).json({ 'exists': resp.rowCount });
}
