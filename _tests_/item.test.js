
const Item = require("../js/item.js");

let item;
beforeEach(() => {
    const jane = {name: "Jane"};
    const colin = {name: "Colin"};
    item = new Item(1000, [{person: jane, proportion: 3}, {person: colin, proportion: 1}]);
});

describe("Item", () => {
    it("can be instantiated", () => {
        expect(item).toBeInstanceOf(Item);
    });

    it("was chosen by 2 people", () => {
        expect(item.sharedBetween.length).toBe(2);
    });

    it("was shared by Jane & Colin", () => {
        expect(item.sharedBetween[0].person.name).toBe("Jane");
        expect(item.sharedBetween[1].person.name).toBe("Colin");
    });

    it("has total cost shared Jane:750, Colin:250", () => {
        const janePortion = item.sharedBetween[0].proportion;
        const colinPortion = item.sharedBetween[1].proportion;
        const totalPortions = janePortion + colinPortion;
        expect((janePortion / totalPortions) * item.amount).toBe(750);
        expect((colinPortion / totalPortions) * item.amount).toBe(250);
    });
});