//BUDGET CONTROLLER
var budgetController = (function () {
    var addData = function(description, value) {
        var desc = description;
        var val = value;
    }
    console.log("Value added:"+value);

    return {
        publicAddData: function(description, value) {
            addData(description, value);
        }
    }
})();

//UI CONTROLLER
var UIController = (function () {

})();

//CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
    document.querySelector('.add__btn').addEventListener('click', function() {
    console.log("hii");
    var description = document.querySelector('.add__description').value;
    var value = document.querySelector('.add__value').value;
    budgetCtrl.publicAddData(description, value);

    });
})(
  budgetController,
  UIController
);
