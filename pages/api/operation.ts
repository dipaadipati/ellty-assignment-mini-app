import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/db";
import { nodes } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Invalid token" });

        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const { parentId, operation, rightValue } = req.body;

        if (!parentId || !operation || rightValue === undefined) {
            return res.status(400).json({ error: "Data not found" });
        }

        const parentNode = (await db.select().from(nodes).where(eq(nodes.id, parentId)))[0];
        if (!parentNode) {
            return res.status(404).json({ error: "Node's parent not found" });
        }

        let result: number;
        switch (operation) {
            case "+":
                result = parentNode.result + rightValue;
                break;
            case "-":
                result = parentNode.result - rightValue;
                break;
            case "*":
                result = parentNode.result * rightValue;
                break;
            case "/":
                if (rightValue === 0) return res.status(400).json({ error: "Cannot divide by zero" });
                result = parentNode.result / rightValue;
                break;
            default:
                return res.status(400).json({ error: "Invalid operation" });
        }

        const newNode = await db.insert(nodes).values({
            parentId,
            operation,
            leftValue: parentNode.result,
            rightValue,
            result,
            userId: payload.id,
        }).returning();

        res.status(200).json(newNode);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
