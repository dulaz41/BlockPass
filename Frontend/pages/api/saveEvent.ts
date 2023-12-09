// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { saveDataToMockFile } from '../../lib/api'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let saveReq = await saveDataToMockFile(req.body)
    res.status(200).json(saveReq)
}
