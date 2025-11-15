import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/db";
import { nodes, users } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = await db
            .select({
                id: nodes.id,
                parentId: nodes.parentId,
                operation: nodes.operation,
                leftValue: nodes.leftValue,
                rightValue: nodes.rightValue,
                result: nodes.result,
                username: users.username,
            })
            .from(nodes)
            .leftJoin(users, eq(nodes.userId, users.id));

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
