import handler from "../pages/api/register";
import { createMocks } from "node-mocks-http";
import * as dbModule from "@/app/db";

describe("API /api/register", () => {
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

    it("should register user successfully", async () => {
        const { req, res } = createMocks({
            method: "POST",
            body: { username: "testuser", password: "secret123" },
        });

        // Mock db.insert().values().returning()
        (dbModule.db.insert as any) = jest.fn().mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([{ id: 1, username: "testuser" }]),
            }),
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.user.username).toBe("testuser");
    });
});
