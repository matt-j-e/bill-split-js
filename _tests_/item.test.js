const Item = require("../js/item.js");

let item;
beforeEach(() => {
    const jane = {name: "Jane"};
    const colin = {name: "Colin"};
    item = new Item(1000, [{person: jane, proportion: 1}, {person: colin, proportion: 1}]);
});

describe("Item", () => {
    it("can be instantiated", () => {
        expect(item).toBeInstanceOf(Item);
    });
});