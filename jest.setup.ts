import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import { TextEncoder, TextDecoder } from "util";
import dotenv from "dotenv";

fetchMock.enableMocks();
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder as any;
dotenv.config({ path: ".env.local" });