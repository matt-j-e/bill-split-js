class Item {
    constructor(amount, sharedBetween) {
        this.amount = amount;
        this.sharedBetween = sharedBetween; // an array of objects made up of {person: person. proportion:n}
        this.tipSupplement = 0;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Item;
} else {
    window.Port = Item;
}