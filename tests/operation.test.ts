import handler from "../pages/api/operation";
import { createMocks } from "node-mocks-http";

describe("API /api/operation", () => {
    it("should return 401 if no token provided", async () => {
        const { req, res } = createMocks({
            method: "POST",
            body: { parentId: 1, operation: "+", rightValue: 5 },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(401);
    });
});
