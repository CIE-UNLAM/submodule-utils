import { fieldTrimmer } from "./sanitize";

describe("fields", () => {
    it("Result should be the same", done => {
        const input = {
            key1: "value1",
            key2: "value2",
            key3: "value3"
        };

        const fields = {
            key1: "",
            key2: "",
            key3: ""
        };
        const res = fieldTrimmer(input, fields);
        expect(res).toEqual({
            key1: "value1",
            key2: "value2",
            key3: "value3"
        });
        done();
    })

    it("Result should be without first element", done => {
        const input = {
            key1: "value1",
            key2: "value2",
            key3: "value3"
        };

        const fields = {
            key2: "",
            key3: ""
        };
        const res = fieldTrimmer(input, fields);
        expect(res).toEqual({
            key2: "value2",
            key3: "value3"
        });
        done();
    });


    it("Result should be empty", done => {
        const input = {
            key1: "value1",
            key2: "value2",
            key3: "value3"
        };

        const fields = {
        };
        const res = fieldTrimmer(input, fields);
        expect(res).toEqual({
        });
        done();
    });


    it("Second should be removed", done => {
        const input = {
            key1: "value1",
            key2: "value2",
            key3: "value3"
        };

        const fields = {
            key1: "",
            key3: "",
        };
        const res = fieldTrimmer(input, fields);
        expect(res).toEqual({
            key1: "value1",
            key3: "value3"
        });
        done();
    })
}); 
