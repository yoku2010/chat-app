import expect from "expect";

import { isRealString } from "./validation";

describe("isRealString", () => {
    it("should reject non-string valutes", () => {
        let res = isRealString(98);
        expect(res).toBe(false);
    });

    it("should reject string with only spaces", () => {
        let res = isRealString("      ");
        expect(res).toBe(false);
    });

    it("should allow string with non-space characters", () => {
        let res = isRealString("Yogesh");
        expect(res).toBe(true);
    });
})