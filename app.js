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
    budgetValue: ".budget__value",
    incomeValue: ".budget__income--value",
    expensesValue: ".budget__expenses--value",
    percentageValue: ".budget__expenses--percentage",
    monthTitle: ".budget__title--month",
  };

  return {
    getInputs: function () {
      return {
        inputType: document.querySelector(DOM.inputType).value,
        inputValue: parseFloat(document.querySelector(DOM.inputValue).value),
        inputDescription: document.querySelector(DOM.inputDescription).value,
      };
    },

    getDOM: function () {
      return DOM;
    },

    addHTMLItem: function (type, obj) {
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
    printBudget: function (obj) {
      document.querySelector(DOM.budgetValue).textContent = obj.budget;
      document.querySelector(DOM.incomeValue).textContent = obj.totalInc;
      document.querySelector(DOM.expensesValue).textContent = obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOM.percentageValue).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOM.percentageValue).textContent = "-";
      }
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
    budget: 0,
    percentage: -1,
  };

  let calcTotal = function (type) {
    // calculate total income or expenses
    data.totalBudget[type] = data.totalItems[type].reduce((sum, item) => {
      return sum + item.value;
    }, 0);
  };

  let calcBudget = function () {
    // calculate the final budget
    data.budget = data.totalBudget.inc - data.totalBudget.exp;
  };

  let calcPercentage = function () {
    // calculate the percentage
    if (data.totalBudget.inc > 0) {
      data.percentage = Math.round(
        (data.totalBudget.exp / data.totalBudget.inc) * 100
      );
    } else {
      data.percentage = -1;
    }
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
    calculateBudget: function () {
      // calculate total income and expenses
      calcTotal("inc");
      calcTotal("exp");
      // calculate the final budget
      calcBudget();
      // calculate the percentage
      calcPercentage();
    },
    getData: function () {
      return {
        totalInc: data.totalBudget.inc,
        totalExp: data.totalBudget.exp,
        budget: data.budget,
        percentage: data.percentage,
      };
    },
  };
})();

// App Controller - Module Pattern
let appController = (function (UICtrl, BudgetCntrl) {
  let newInputController = function () {
    // get the input value
    let inputs = UICtrl.getInputs();
    if (
      inputs.inputDescription !== "" &&
      inputs.inputValue !== Number.NaN &&
      inputs.inputValue > 0
    ) {
      // add the input value to the budget controller
      let addInput = BudgetCntrl.addInput(
        inputs.inputType,
        inputs.inputValue,
        inputs.inputDescription
      );

      // add the input value to the UI
      UICtrl.addHTMLItem(inputs.inputType, addInput);

      // clear the fields
      UICtrl.clearFields();

      // calculate the budget
      updateBudget();
    }
  };

  let addEventListeners = function () {
    let DOM = UICtrl.getDOM();
    document
      .querySelector(DOM.inputBtn)
      .addEventListener("click", newInputController);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        newInputController();
      }
    });
  };

  let updateBudget = function () {
    // calculate the budget
    BudgetCntrl.calculateBudget();
    // get the budget data
    let budget = BudgetCntrl.getData();

    // add the total budget to the UI
    UICtrl.printBudget(budget);
    // console.log(budget);
  };

  return {
    init: function () {
      updateBudget();
      addEventListeners();
    },
  };
})(UIController, BudgetController);

appController.init();
