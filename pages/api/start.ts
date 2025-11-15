import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/db";
import { nodes } from "@/app/db/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { startNumber, userId } = req.body;

        const result = await db.insert(nodes).values({
            parentId: null,
            operation: null,
            leftValue: startNumber,
            rightValue: null,
            result: startNumber,
            userId,
        }).returning();

        res.status(200).json(result);
    } else {
        res.status(405).end();
    }
}
