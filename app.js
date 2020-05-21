//BUDGET CONTROLLER
var budgetController = (function () {

    //Expense function constructure
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Income function constructure
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Storing data using data structure
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
        //Adding item to the data structure incrementing ID 
        addItems: function (type, desc, val) {
            var ID, newItem;
            //Value of ID for each Item
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }
            //Enter the data to particular object 'inc' or 'exp'
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

    //Access DOM class names
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
    };

    return {
        //Passng input values as object
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            };
        },
        //Insert items in the list
        getItemList: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Replacing the placeholder
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //Inserting Item to HTML
            document.querySelector(element).insertAdjacentHTML("beforeEnd", newHtml);
        },
        //Return the DOM Strings to controller
        getDOMstrings: function () {
            return DOMstrings;
        }
    }
})();

//GLOBAL CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    //Event Listener Functions
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
        UICtrl.getItemList(data, input.type);
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
