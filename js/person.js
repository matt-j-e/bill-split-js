class Person {
    constructor(name) {
        this.name = name;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Person;
} else {
    window.Port = Person;
}