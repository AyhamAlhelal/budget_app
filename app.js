"use strict";

// UI Controller - Module Pattern
let UIController = (function () {
  let DOM = {
    inputValue: ".add__value",
    inputDescription: ".add__description",
    inputType: ".add__type",
    inputBtn: ".add__btn",
    incomeList: ".income__list",
    expensesList: ".expenses__list",
  };

  return {
    getInputs: function () {
      return {
        inputType: document.querySelector(DOM.inputType).value,
        inputValue: document.querySelector(DOM.inputValue).value,
        inputDescription: document.querySelector(DOM.inputDescription).value,
      };
    },

    getDOM: function () {
      return DOM;
    },

    addHTMLItems: function (type, obj) {
      let html, newItem, parentItem;
      if (type === "inc") {
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        parentItem = DOM.incomeList;
      } else if (type === "exp") {
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        parentItem = DOM.expensesList;
      }

      // insert the object values in the html element
      newItem = html.replace("%id%", obj.id);
      newItem = newItem.replace("%description%", obj.description);
      newItem = newItem.replace("%value%", obj.value);

      // insert the html element into its html parent
      document
        .querySelector(parentItem)
        .insertAdjacentHTML("beforeend", newItem);
    },
    clearFields: function () {
      let fieldsList, fieldsAry;
      fieldsList = document.querySelectorAll(
        DOM.inputDescription + ", " + DOM.inputValue
      );
      fieldsAry = Array.prototype.slice.call(fieldsList);

      fieldsAry.forEach((val) => {
        val.value = "";
      });
      fieldsAry[0].focus();
    },
  };
})();

// Budget Controller - Module Pattern
let BudgetController = (function () {
  // code

  class Income {
    constructor(id, value, description) {
      this.id = id;
      this.value = value;
      this.description = description;
    }
  }

  class Expense {
    constructor(id, value, description) {
      this.id = id;
      this.value = value;
      this.description = description;
    }
  }

  let data = {
    totalItems: {
      inc: [],
      exp: [],
    },
    totalBudget: {
      inc: 0,
      exp: 0,
    },
  };
  return {
    addInput: function (type, value, description) {
      let newInput, id;
      if (data.totalItems[type].length > 0) {
        id = data.totalItems[type][data.totalItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      if (type === "inc") {
        newInput = new Income(id, value, description);
      } else if (type === "exp") {
        newInput = new Expense(id, value, description);
      }
      data.totalItems[type].push(newInput);
      return newInput;
    },
  };
})();

// App Controller - Module Pattern
let appController = (function (UICtrl, BudgetCntrl) {
  let valueController = function () {
    // get the input value
    let inputs = UICtrl.getInputs();

    // add the input value to the budget controller
    let addInput = BudgetCntrl.addInput(
      inputs.inputType,
      inputs.inputValue,
      inputs.inputDescription
    );
    // add the input value to the UI
    UICtrl.addHTMLItems(inputs.inputType, addInput);

    // clear the fields
    UICtrl.clearFields();
    // calculate the budget
    // add the total budget to the UI
  };

  let addEventListeners = function () {
    let DOM = UICtrl.getDOM();
    document
      .querySelector(DOM.inputBtn)
      .addEventListener("click", valueController);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        valueController();
      }
    });
  };

  return {
    init: function () {
      addEventListeners();
    },
  };
})(UIController, BudgetController);

appController.init();
