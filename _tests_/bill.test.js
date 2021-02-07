const Bill = require("../js/bill.js");

let bill, jane, colin, kirstie, matt;
let testItems = [];
beforeEach(() => {
    jane = {name: "Jane"};
    colin = {name: "Colin"};
    kirstie = {name: "Kirstie"};
    matt = {name: "Matt"};
    testItems[0] = {
        amount: 1000,
        sharedBetween: [
            {person: jane, proportion: 3},
            {person: colin, proportion: 1}
        ]
    };
    testItems[1] = {
        amount: 1000,
        sharedBetween: [
            {person: kirstie, proportion: 1},
            {person: matt, proportion: 1}
        ]
    };
    testItems[2] = {
        amount: 1500,
        sharedBetween: [
            {person: kirstie, proportion: 1},
            {person: matt, proportion: 1}
        ]
    };
    testItems[3] = {
        amount: 2000,
        sharedBetween: [
            {person: jane, proportion: 1},
            {person: colin, proportion: 1}
        ]
    };
    testItems[4] = {
        amount: 500,
        sharedBetween: [
            {person: matt, proportion: 1}
        ]
    };
    bill = new Bill(6000);
})

describe("Bill", () => {
    it("can be instantiated", () => {
        expect(bill).toBeInstanceOf(Bill);
    });
});

describe("addItem", () => {
    it("adds an item to the Bill.items array", () => {
        bill.addItem(testItems[0]);
        expect(bill.items.length).toBe(1);
    });

    it("adds more than one item to the Bill.items array", () => {
        bill.addItem(testItems[0]);
        bill.addItem(testItems[1]);
        expect(bill.items.length).toBe(2);
    });
});

describe("totalReached", () => {
    it("returns false when total not reached", () => {
        bill.addItem(testItems[0]);
        expect(bill.totalReached).toBe(false);
    });

    it("returns true when total is reached", () => {
        bill.addItem(testItems[0]);
        bill.addItem(testItems[1]);
        bill.addItem(testItems[2]);
        bill.addItem(testItems[3]);
        bill.addItem(testItems[4]);
        expect(bill.totalReached).toBe(true);
    });
});

describe("CalculateSplit", () => {
    it("splits the bill between people in appropriate proportions", () => {
        bill.addItem(testItems[0]);
        bill.addItem(testItems[1]);
        bill.addItem(testItems[2]);
        bill.addItem(testItems[3]);
        bill.addItem(testItems[4]);
        bill.calculateSplit();
        const split = [];
        for (let i = 0; i < bill.split.length; i++) {
            split[i] = bill.split[i].itemsPrices.reduce((acc, price) => {
                return acc + price;
            }, 0);
        }
        expect(split[0]).toEqual(1750);
        expect(split[1]).toEqual(1250);
        expect(split[0] + split[1] + split[2] + split[3]).toBe(bill.amount);
    });

    it("Returns an error if items total doesn't match bill amount", () => {
        bill.addItem(testItems[0]);
        bill.addItem(testItems[1]);
        bill.addItem(testItems[2]);
        bill.addItem(testItems[3]);
        
        expect(bill.calculateSplit()).toBe("Items allocated don't add up to the bill amount");
    });
});

describe("shareOfItem", () => {
    it("calculates a person's share of the cost of an item", () => {
        expect(bill.shareOfItem(testItems[0], jane)).toEqual(750);
        expect(bill.shareOfItem(testItems[0], matt)).toEqual(0);
    });
});

describe("peopleArray", () => {
    it("returns an array of person objects", () => {
        bill.addItem(testItems[0]);
        bill.addItem(testItems[1]);
        expect(bill.peopleArray).toContain(jane);
    });
});

describe("Sum of proportions", () => {
    it("adds up all separate proportions of a given item", () => {
        expect(bill.sumOfProportions(testItems[0])).toBe(4);
        expect(bill.sumOfProportions(testItems[1])).toBe(2);
    });
});