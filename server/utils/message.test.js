import expect from "expect";

import { generateMessage } from "./message";

describe("generateMessage", () => {
    it("should generate correct message object", () => {
        let from = "Yogesh";
        let text = "Some message";
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA("number");
        expect(message).toInclude({from, text});
    });
})