const { beforeEach, it, expect } = require("@jest/globals");
const Person = require("../js/person.js");

let person;
beforeEach(() => {
    person = new Person("Kirstie");
});

describe("Person object", () => {
    it("can be instantiated", () => {
        expect(person).toBeInstanceOf(Person);
    });

    it("is called Kirstie", () => {
        expect(person.name).toBe("Kirstie");
    });
})