
class Controller {
    constructor() {
        this.people = [];
        this.renderNamesList();

        document.querySelector("#nameSubmit").addEventListener("click", () => this.addName());
        document.querySelector("#splitBillButton").addEventListener("click", () => this.progressToBill());
        document.querySelector("#billSubmit").addEventListener("click", () => this.addBillAmount());
        document.querySelector("#itemSubmit").addEventListener("click", () => this.addItemAmount());
        
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
        document.querySelector("#addBill").style.display = "block";
    }

    addBillAmount() {
        const billTotalInput = document.querySelector("#billTotal");
        const billTotal = billTotalInput.value;
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

    addItemAmount() {
        const itemAmountInput = document.querySelector("#itemAmount");
        const itemAmount = itemAmountInput.value;
        const item = new Item(itemAmount, this.sharedBetweenArray);
        this.bill.addItem(item);
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
                obj = {person: personObj, proportion: div.lastChild.value};
                sharedBetween.push(obj);
            }
        });
        return sharedBetween;
    }


}