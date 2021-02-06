const { MODULESPECIFIER_TYPES } = require("@babel/types");

class Person {
    constructor(name) {
        this.name = name;
    }
}

module.exports = Person;