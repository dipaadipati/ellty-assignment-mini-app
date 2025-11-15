import handler from "../pages/api/login";
import { createMocks } from "node-mocks-http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dbModule from "@/app/db";

describe("API /api/login", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should return 400 if username or password missing", async () => {
        const { req, res } = createMocks({
            method: "POST",
            body: { username: "", password: "" },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual({
            error: "Username and password should be not empty!",
        });
    });

    it("should return 401 if user not found", async () => {
        // Mock db.select to return empty
        (dbModule.db.select as any) = jest.fn().mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const { req, res } = createMocks({
            method: "POST",
            body: { username: "nouser", password: "secret" },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(401);
        expect(JSON.parse(res._getData())).toEqual({
            error: "User not found",
        });
    });

    it("should return 401 if password wrong", async () => {
        (dbModule.db.select as any) = jest.fn().mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([
                    { id: 1, username: "testuser", passwordHash: await bcrypt.hash("correct", 10) },
                ]),
            }),
        });

        const { req, res } = createMocks({
            method: "POST",
            body: { username: "testuser", password: "wrong" },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(401);
        expect(JSON.parse(res._getData())).toEqual({
            error: "Wrong password",
        });
    });

    it("should return token if login success", async () => {
        const passwordHash = await bcrypt.hash("secret123", 10);

        (dbModule.db.select as any) = jest.fn().mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([
                    { id: 1, username: "testuser", passwordHash },
                ]),
            }),
        });

        const { req, res } = createMocks({
            method: "POST",
            body: { username: "testuser", password: "secret123" },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);

        const data = JSON.parse(res._getData());
        expect(data.user.username).toBe("testuser");
        expect(typeof data.token).toBe("string");

        // Verify token
        const decoded = jwt.verify(data.token, process.env.JWT_SECRET!);
        expect((decoded as any).username).toBe("testuser");
    });
});
