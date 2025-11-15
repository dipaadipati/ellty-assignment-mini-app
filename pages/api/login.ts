import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password should be not empty!" });
    }

    const result = await db.select().from(users).where(eq(users.username, username));
    const user = result[0];

    if (!user) {
        return res.status(401).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
    });

    res.status(200).json({ token, user });
}
