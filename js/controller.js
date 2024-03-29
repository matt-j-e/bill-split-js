
class Controller {
    constructor() {
        this.people = [];
        // this.renderNamesList();
        document.querySelector("#name").focus();

        document.querySelector("#nameSubmit").addEventListener("click", () => this.addName());
        document.querySelector("#splitBillButton").addEventListener("click", () => this.progressToBill());
        document.querySelector("#billSubmit").addEventListener("click", () => this.addBillAmount());
        document.querySelector("#itemSubmit").addEventListener("click", () => this.addItem());
        document.querySelector("#tipSubmit").addEventListener("click", () => this.addTip());
        document.querySelector("#showDetailedSplit").addEventListener("click", () => this.showDetailedSplit());

        if ("serviceWorker" in navigator) {
            window.addEventListener("load", function() {
              navigator.serviceWorker
                .register("/sw.js")
                .then(res => console.log("service worker registered"))
                .catch(err => console.log("service worker not registered", err))
            })
          }
          
    }

    addName() {
        const nameInput = document.querySelector("#name");
        const name = nameInput.value;
        const person = { name: name };
        this.people.push(person);
        nameInput.value = "";
        this.renderNamesList();
        nameInput.focus();
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
        const billTotal = parseFloat(billTotalInput.value) * 100;
        this.bill = new Bill(billTotal);
        document.querySelector("#totalAmountToSplit > span").innerText = (this.bill.amount / 100).toFixed(2);
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
        const itemAmount = parseFloat(itemAmountInput.value) * 100;
        const item = new Item(itemAmount, this.sharedBetweenArray);
        this.bill.addItem(item);
        this.updateTotalItemsSoFar();
        if (this.bill.totalReached) {
            document.querySelector("#addItem").style.display = "none";
            document.querySelector("#totalAmountToSplit").style.display = "none";
            document.querySelector("#totalItemsSoFar").style.display = "none";
            document.querySelector("#allItemsAllocated").style.display = "block";
            this.bill.calculateSplit();
            console.log(this.bill.split);
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
        itemsSoFarElement.innerText = (this.bill.currentTotal / 100).toFixed(2);
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
        document.querySelector("#allItemsAllocated").style.display = "none";
        document.querySelector("#finalSplit").style.display = "block";
        document.querySelector("#addTip").style.display = "none";
        const billAmount = parseInt(this.bill.amount);
        const tipAmount = this.bill.tip;
        const finalSplitElement = document.querySelector("#finalSplit ul");
        this.bill.split.forEach((person) => {
            const li = document.createElement("li");
            const billShare = this.splitTotaliser(person.itemsPrices);
            const tipShare = Math.round(this.bill.tip * (billShare / billAmount));
            const totalShare = billShare + tipShare;
            li.innerHTML = `<span class="name">${person.name}</span><span>£${(totalShare / 100).toFixed(2)}</span>`;
            finalSplitElement.appendChild(li);
        });
        const totalLi = document.createElement("li");
        totalLi.classList.add("finalTotal");
        totalLi.innerHTML = `<span>Total</span><span>£${((billAmount + tipAmount) / 100).toFixed(2)}</span>`;
        finalSplitElement.appendChild(totalLi);
    }

    showDetailedSplit() {
        document.querySelector("#detailedSplit").style.display = "block";
        document.querySelector("#showDetailedSplit").style.display = "none";
    }

    renderFinalSplitTable() {
        document.querySelector("#allItemsAllocated").style.display = "none";
        document.querySelector("#finalSplit").style.display = "block";
        document.querySelector("#addTip").style.display = "none";
        const billAmount = parseInt(this.bill.amount);
        const tipAmount = this.bill.tip;
        const table = document.querySelector("#finalSplit table");
        const columns = this.bill.split.length;
        const rows = this.bill.split[0].itemsPrices.length;
        // HEADER ROW
        const headerRow = createElement("tr", "headers");
        const itemsHeader = createElement("th", "left", null, "Item");
        headerRow.appendChild(itemsHeader);
        this.bill.split.forEach((person) => {
            const nameHeader = createElement("th", "right", null, person.name);
            headerRow.appendChild(nameHeader);
        });
        const itemsTotalHeader = createElement("th", "right", null, "Total");
        headerRow.appendChild(itemsTotalHeader);
        table.appendChild(headerRow);
        // DATA ROWS
        for (let r = 0; r < rows; r++) {
            const tableRow = createElement("tr");
            const itemCell = createElement("th", "left", [{name: "scope", setting: "row"}], r + 1);
            tableRow.appendChild(itemCell);
            let itemTotal = 0;
            for (let c = 0; c < columns; c++) {
                const shareOfItem = this.bill.split[c].itemsPrices[r];
                const dataCell = createElement("td", "right", null, shareOfItem > 0 ? (shareOfItem / 100).toFixed(2) : "-");
                itemTotal += shareOfItem;
                tableRow.appendChild(dataCell);
            }
            const itemTotalCell = createElement("td", "right", null, (itemTotal / 100).toFixed(2));
            tableRow.appendChild(itemTotalCell);
            table.appendChild(tableRow);
        }
        // SUB-TOTAL ROW
        const subtotalRow = createElement("tr", "sub-total");
        const itemSubtotal = createElement("th", "left", [{name: "scope", setting: "row"}]);
        subtotalRow.appendChild(itemSubtotal);
        this.bill.split.forEach((person) => {
            const billShare = this.splitTotaliser(person.itemsPrices);
            const nameTotal = createElement("td", "right", null, (billShare / 100).toFixed(2));
            subtotalRow.appendChild(nameTotal);
        });
        const subtotalTotalCell = createElement("td", "right", null, (billAmount / 100).toFixed(2));
        subtotalRow.appendChild(subtotalTotalCell);
        table.appendChild(subtotalRow);
        // TIPS ROW
        const tipsRow = createElement("tr");
        const tipsHeader = createElement("th", "left", [{name: "scope", setting: "row"}], "Tip");
        tipsRow.appendChild(tipsHeader);
        this.bill.split.forEach(person => {
            const billShare = this.splitTotaliser(person.itemsPrices);
            const tipShare = (tipAmount / billAmount) * billShare;
            const tipShareCell = createElement("td", "right", null, tipShare > 0 ? (tipShare / 100).toFixed(2) : "-");
            tipsRow.appendChild(tipShareCell);
        });
        const tipsTotalCell = createElement("td", "right", null, tipAmount > 0 ? (tipAmount / 100).toFixed(2) : "-");
        tipsRow.appendChild(tipsTotalCell);
        table.appendChild(tipsRow);
        // TOTAL ROW
        const totalRow = createElement("tr", "total");
        const itemTotal = createElement("th", "left", [{name: "scope", setting: "row"}]);
        totalRow.appendChild(itemTotal);
        this.bill.split.forEach(person => {
            const billShare = this.splitTotaliser(person.itemsPrices);
            const tipShare = (tipAmount / billAmount) * billShare;
            const totalShare = billShare + tipShare;
            const totalShareCell = createElement("td", "right", null, (totalShare / 100).toFixed(2));
            totalRow.appendChild(totalShareCell);
        });
        const totalTotalCell = createElement("td", "right", null, ((billAmount + tipAmount) / 100).toFixed(2));
        totalRow.appendChild(totalTotalCell);
        table.appendChild(totalRow);
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
        fiveUpElement.innerText = (fiveUp / 100).toFixed(2);
        tenUpElement.innerText = (tenUp / 100).toFixed(2);
        fiveUpGrandElement.innerText = ((billAmount + fiveUp) / 100).toFixed(2);
        tenUpGrandElement.innerText = ((billAmount + tenUp) / 100).toFixed(2);
    }

    addTip() {
        const billAmount = parseInt(this.bill.amount);
        const tipAmountInput = document.querySelector("#tipAmount");
        const tipValue = tipAmountInput.value || 0;
        this.bill.tip = parseFloat(tipValue) * 100;
        this.renderFinalSplit();
        this.renderFinalSplitTable();
    }

}