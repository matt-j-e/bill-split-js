
class Controller {
    constructor() {
        this.people = [];
        this.renderNamesList();

        document.querySelector("#nameSubmit").addEventListener("click", () => this.addName());
        document.querySelector("#splitBillButton").addEventListener("click", () => this.progressToBill());
        document.querySelector("#billSubmit").addEventListener("click", () => this.addBillAmount());
        document.querySelector("#itemSubmit").addEventListener("click", () => this.addItem());
        document.querySelector("#tipSubmit").addEventListener("click", () => this.addTip());
    }

    addName() {
        const nameInput = document.querySelector("#name");
        const name = nameInput.value;
        const person = { name: name };
        this.people.push(person);
        // console.log(this.people);
        nameInput.value = "";
        this.renderNamesList();
    }

    renderNamesList() {
        if (this.people.length === 0) return;
        this.clearNamesList();
        const ul = document.querySelector("#namesList");
        this.people.forEach((person) => {
            const li = document.createElement("li");
            li.innerText = person.name;
            ul.appendChild(li);
        });
    }

    clearNamesList() {
        const ul = document.querySelector("#namesList");
        const lis = document.querySelectorAll("#namesList > li");
        lis.forEach(li => ul.removeChild(li));
    }

    progressToBill() {
        // hide or display page sections as required
        document.querySelector("#addName").style.display = "none";
        document.querySelector("#splitBillButton").style.display = "none";
        document.querySelector("#namesList").style.display = "none";
        document.querySelector("#addBill").style.display = "block";
    }

    addBillAmount() {
        const billTotalInput = document.querySelector("#billTotal");
        const billTotal = parseInt(billTotalInput.value);
        this.bill = new Bill(billTotal);
        // console.log(this.bill);
        document.querySelector("#totalAmountToSplit > span").innerText = this.bill.amount / 100;
        document.querySelector("#addBill").style.display = "none";
        document.querySelector("#totalAmountToSplit").style.display = "block";
        this.renderItemSharingInputs();
        document.querySelector("#addItem").style.display = "block";
    }

    renderItemSharingInputs() {
        const container = document.querySelector("#sharedBetween");
        this.people.forEach((person) => {
            // create a div to hold this person
            const div = document.createElement("div");
            div.setAttribute("id", person.name);

            // create tickbox
            const input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("id", `${person.name}-check`);
            input.classList.add("shareCheck");
            input.addEventListener("click", (e) => this.portionToggle(e));

            // create tick box label
            const label = document.createElement("label");
            label.setAttribute("for", `${person.name}-check`);
            label.innerText = person.name;

            // create select element, disply: none initially
            const select = document.createElement("select");
            select.style.display = "none";
            for (let i = 1; i < 11; i++) {
                let option = document.createElement("option");
                option.setAttribute("value", `${i}`);
                option.innerText = i;
                select.appendChild(option);
            }

            // add all elements to div; add div to page
            div.appendChild(input);
            div.appendChild(label);
            div.appendChild(select);
            container.appendChild(div);
        });
    }

    portionToggle(e) {
        const selectElement = e.target.nextSibling.nextSibling;
        selectElement.style.display = selectElement.style.display === "none" ? "inline" : "none";
    }

    addItem() {
        document.querySelector("#totalItemsSoFar").style.display = "block";
        const itemAmountInput = document.querySelector("#itemAmount");
        const itemAmount = parseInt(itemAmountInput.value);
        const item = new Item(itemAmount, this.sharedBetweenArray);
        this.bill.addItem(item);
        this.updateTotalItemsSoFar();
        if (this.bill.totalReached) {
            document.querySelector("#addItem").style.display = "none";
            this.bill.calculateSplit();
            console.log(this.bill.split);
            // this.renderFinalSplit();
            this.renderAddTip();
        } else {
            this.clearAddItemFields();
        }
    }

    get sharedBetweenArray() {
        const sharedBetween = [];
        let personObj, obj;
        const divs = document.querySelectorAll("#sharedBetween > div");
        divs.forEach((div) => {
            // console.log(div.id);
            // console.log(div.lastChild.value);
            // console.log(div.lastChild.style.display);
            if (div.lastChild.style.display === "inline") {
                personObj = this.people.find(person => person.name === div.id);
                obj = {person: personObj, proportion: parseInt(div.lastChild.value)};
                sharedBetween.push(obj);
            }
        });
        return sharedBetween;
    }

    updateTotalItemsSoFar() {
        const itemsSoFarElement = document.querySelector("#totalItemsSoFar > span");
        // const totalSoFar = this.bill.items.reduce((acc, item) => {
        //     return acc + item.amount;
        // }, 0);
        // itemsSoFarElement.innerText = totalSoFar / 100;
        itemsSoFarElement.innerText = this.bill.currentTotal / 100;
        // return totalSoFar;
    }

    clearAddItemFields() {
        const itemAmountInput = document.querySelector("#itemAmount");
        itemAmountInput.value = "";
        const shared = document.querySelector("#sharedBetween");
        const sharers = shared.querySelectorAll("div");
        sharers.forEach(sharer => shared.removeChild(sharer));
        this.renderItemSharingInputs();
        itemAmountInput.focus();
    }

    renderFinalSplit() {
        const billAmount = parseInt(this.bill.amount);
        const tipAmount = this.bill.tip;
        const finalSplitElement = document.querySelector("#finalSplit ul");
        this.bill.split.forEach((person) => {
            const li = document.createElement("li");
            const billShare = this.splitTotaliser(person.itemsPrices);
            let tipShare = 0;
            if (tipAmount > 0) {
                tipShare = Math.round(this.bill.tip * (billShare / billAmount));
            }
            const totalShare = billShare + tipShare;
            li.innerHTML = `${person.name}: <b>£${billShare / 100}</b>`;
            if (tipShare > 0) {
                li.innerHTML += ` plus £${tipShare / 100} = £${totalShare / 100}`;
            }
            finalSplitElement.appendChild(li);
        });
        const totalLi = document.createElement("li");
        totalLi.innerHTML = `Total: <b>£${billAmount / 100}</b>`;
        if (tipAmount > 0) {
            totalLi.innerHTML += ` plus £${tipAmount / 100} = £${(billAmount + tipAmount) / 100}`;
        }
    }

    splitTotaliser(itemsPrices) {
        // a helper function to add an individual's share of each item and round accordingly
        // takes in the itemsPrices array from this.bill.split
        const tot = itemsPrices.reduce((acc, itemPrice) => {
            return acc + itemPrice;
        }, 0);
        return Math.round(tot);
    }

    renderAddTip() {
        const billAmount = parseInt(this.bill.amount);
        document.querySelector("#addTip").style.display = "block";
        const fiveUpElement = document.querySelector("#fiveUp");
        const tenUpElement = document.querySelector("#tenUp");
        const fiveUpGrandElement = document.querySelector("#fiveUpGrand");
        const tenUpGrandElement = document.querySelector("#tenUpGrand");
        const fiveUp = Math.ceil((billAmount * 1.05)/100)*100 - billAmount;
        const tenUp = Math.ceil((billAmount * 1.10)/100)*100 - billAmount;
        fiveUpElement.innerText = fiveUp / 100;
        tenUpElement.innerText = tenUp / 100;
        fiveUpGrandElement.innerText = (billAmount + fiveUp) / 100;
        tenUpGrandElement.innerText = (billAmount + tenUp) / 100;
    }

    addTip() {
        const billAmount = parseInt(this.bill.amount);
        const tipAmountInput = document.querySelector("#tipAmount");
        this.bill.tip = parseInt(tipAmountInput.value);
        this.renderFinalSplit();
    }

}