class Item {
    constructor(amount, sharedBetween) {
        this.amount = amount;
        this.sharedBetween = sharedBetween; // an array of objects made up of {person: person. proportion:n}
        this.tipSupplement = 0;
    }

    calcTipSupplement() {
        // this method will need access to the Bill object's tip proportion (tip amount / bill amount)
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Item;
} else {
    window.Port = Item;
}