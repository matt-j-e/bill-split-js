class Bill {
    constructor(amount, tip) {
        this.amount = amount;
        this.tip = tip;
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
        if this.totalReached() console.log("Total reached")
    }

    totalReached() {
        const currentTotal = this.items.reduce((acc, item) => {
            return acc + item.amount;
        }, 0);
        return currentTotal === this.amount; // will return true if items add up to Bill amount
    }
 }