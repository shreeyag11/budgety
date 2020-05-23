//BUDGET CONTROLLER
var budgetController = (function () {

    //Expense function constructure
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalInc) {
        if(totalInc > 0){
            this.percentage = Math.round((this.value / totalInc) * 100);
        }
        else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    //Income function constructure
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (curr) {
            sum += curr.value;
        });
        data.totals[type] = sum;
    }

    //Storing data using data structure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: 0,
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
        },
        deleteItem: function (type, id) {
            var index, ids;
            ids = data.allItems[type].map(function (curr) {
                return curr.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function () {
            //calculate total income and expense
            calculateTotal('inc');
            calculateTotal('exp');
            //calculate the budget: income-expense
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },
        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                income: data.totals.inc,
                expense: data.totals.exp,
            }
        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(curr) {
                curr.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });
            return allPerc;
        },
        test: function () {
            console.log(data);
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
        budget: '.budget__value',
        income: '.budget__income--value',
        expense: '.budget__expenses--value',
        percentage: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel: '.item__percentage',
    };

    return {
        //Passng input values as object
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },
        //Insert items in the list
        getItemList: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fal fa-times-circle"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="fal fa-times-circle"></i></button></div></div></div>';
            }
            //Replacing the placeholder
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //Inserting Item to HTML
            document.querySelector(element).insertAdjacentHTML("beforeEnd", newHtml);
        },
        //Clearing the fields
        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (curr, index, array) {
                curr.value = "";
            });
            fieldsArr[0].focus();
        },
        //Display Budget
        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budget).textContent = obj.budget;
            document.querySelector(DOMstrings.income).textContent = obj.income;
            document.querySelector(DOMstrings.expense).textContent = obj.expense;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentage).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentage).textContent = '---';
            }
        },
        //delete item from UI
        deleteItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        //display percentage
        displayPercentages: function(percentage) {
            var fields = document.querySelectorAll(DOMstrings.expensePercentageLabel);
            var nodeListForEach = function(list, callback) {
                for(var i=0; i<list.length;i++){
                    callback(list[i], i);
                }
            }

            nodeListForEach(fields, function(curr, index) {
                if(percentage[index] > 0) {
                    curr.textContent = percentage[index] + '%';
                }
                else {
                    curr.textContent = '---';
                }
            });
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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    var updateBudget = function () {
        //calculate budget
        budgetCtrl.calculateBudget();
        //return budget
        var budget = budgetCtrl.getBudget();
        //display the udget in UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages= function() {
        //Calculate percentages
        budgetCtrl.calculatePercentages();
        //Return percentages
        var percentages = budgetCtrl.getPercentages();
        //Update UI
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        //Get field input data
        var input = UICtrl.getinput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //Add item to budget controller 
            var data = budgetCtrl.addItems(input.type, input.description, input.value);

            //Add the item UICtrl
            UICtrl.getItemList(data, input.type);

            //Clear input fields
            UICtrl.clearFields();
            
            //Update budget
            updateBudget();

            //Update percentage
            updatePercentages();

        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
            //delete the item from the data structure
            budgetCtrl.deleteItem(type, id);

            //delete the item from the UI
            UICtrl.deleteItem(itemID);
            
            //Update and show the new budget
            updateBudget();

            //Update percentage
            updatePercentages();
        }
    };

    return {
        init: function () {
            UICtrl.displayBudget({
                budget: 0,
                percentage: -1,
                income: 0,
                expense: 0,
            });
            setupEventListeners();
        }
    }
})(
    budgetController,
    UIController
);

controller.init();
