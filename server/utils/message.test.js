import expect from "expect";

import { generateMessage, generateLocationMessage } from "./message";

describe("generateMessage", () => {
    it("should generate correct message object", () => {
        let from = "Yogesh";
        let text = "Some message";
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA("number");
        expect(message).toInclude({from, text});
    });
});

describe("generateLocationMessage", () => {
    it("should generate correct location object", () => {
        let from = "Yogesh";
        let latitude = 15;
        let longitude = 19;
        let url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        var message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA("number");
        expect(message).toInclude({from, url});
    });
});