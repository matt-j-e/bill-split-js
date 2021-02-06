class Item {
    constructor(amount, people) {
        this.amount = amount;
        this.people = people; // an array of objects made up of {person: person. proportion:n}
        this.tipSupplement = 0;
    }

    calcTipSupplement() {
        // this method will need access to the Bill object's tip proportion (tip amount / bill amount)
    }
}

module.exports = Item;