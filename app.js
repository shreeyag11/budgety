//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItems: function (type, desc, val) {
            var ID, newItem;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            }
            else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, desc, val);
            }
            else if (type === 'inc') {
                newItem = new Income(ID, desc, val)
            }
            data.allItems[type].push(newItem);
            return newItem;
        }
    }

})();

//UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    };

    return {
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            };
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    }
})();

//GLOBAL CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    var ctrlAddItem = function () {
        var input = UICtrl.getinput();
        var data = budgetCtrl.addItems(input.type, input.description, input.value);
        console.log(data);
    }

    return {
        init: function () {
            console.log("Application started");
            setupEventListeners();
        }
    }
})(
    budgetController,
    UIController
);

controller.init();
