"use strict";

// UI Controller - Module Pattern
let UIController = (function () {
  let DOM = {
    inputValue: ".add__value",
    inputDescription: ".add__description",
    inputType: ".add__type",
    inputBtn: ".add__btn",
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
})();

// App Controller - Module Pattern
let appController = (function (UICtrl, BudgetCntrl) {
  let valueController = function () {
    // get the input value
    let inputs = UICtrl.getInputs();

    // add the input value to the budget controller

    // add the input value to the UI
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
