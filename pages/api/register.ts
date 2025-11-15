import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password should be not empty!" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const result = await db.insert(users).values({
            username,
            passwordHash,
        }).returning();

        res.status(200).json({ user: result[0] });
    } catch (err) {
        res.status(500).json({ error: "Failed to register" });
    }
}
