class Bill {
    constructor(amount, tip=0) {
        this.amount = amount;
        this.tip = tip;
        this.items = [];
        this.split = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    get currentTotal() {
        const currentTotal = this.items.reduce((acc, item) => {
            return acc + item.amount;
        }, 0);
        return currentTotal;
    }

    get totalReached() {
        return this.currentTotal === this.amount; // will return true if items add up to Bill amount
    }

    calculateSplit() {
        if (!this.totalReached) return "Items allocated don't add up to the bill amount";
        this.peopleArray.forEach((person) => {
            const obj = {};
            obj.name = person.name;
            obj.itemsPrices = [];
            this.items.forEach((item) => {
                obj.itemsPrices.push(this.shareOfItem(item, person));
            });
            this.split.push(obj);
        });
    }

    get peopleArray() {
        const people = [];
        this.items.forEach((item) => {
            item.sharedBetween.forEach((sharer) => {
                if (!people.includes(sharer.person)) people.push(sharer.person);
            })
        });
        return people;
    }

    shareOfItem(item, targetPerson) {
        let share = 0;
        item.sharedBetween.forEach((sharer) => {
            if (sharer.person === targetPerson) {
                share = item.amount * (sharer.proportion / this.sumOfProportions(item));
            }
        });
        return share;
    }

    sumOfProportions(item) {
        const sumOfProportions = item.sharedBetween.reduce((acc, person) => {
            return acc + person.proportion;
        }, 0);
        return sumOfProportions;
    }
 }

 if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bill;
} else {
    window.Port = Bill;
}