"use strict";
/*--------------------------------
 UI Controller - Module Pattern
--------------------------------*/
let UIController = (function () {
  // DOM classes
  const DOM = {
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
    container: ".container",
    itemPercentage: ".item__percentage",
  };

  let formatNum = function (num, type) {
    let splitesNum, int, dec;

    let reversing = function (str) {
      return str.split("").reverse().join("");
    };
    let formating = function (string) {
      let str = reversing(string);
      let numStr = "";
      for (let i = 0; i < str.length; i = i + 3) {
        if (i + 3 < str.length) {
          numStr = numStr + str.substr(i, 3) + ",";
        } else {
          numStr = numStr + str.substr(i);
        }
      }
      return reversing(numStr);
    };

    num = Math.abs(num);
    num = num.toFixed(2);

    splitesNum = num.split(".");
    int = splitesNum[0];
    dec = splitesNum[1];

    int = formating(int);

    return (type === "inc" ? "+" : "-") + " " + int + "." + dec;
  };

  return {
    // get the input UI fields' values
    getInputs: function () {
      return {
        inputType: document.querySelector(DOM.inputType).value,
        inputValue: parseFloat(document.querySelector(DOM.inputValue).value),
        inputDescription: document.querySelector(DOM.inputDescription).value,
      };
    },

    // get the DOM classes
    getDOM: function () {
      return DOM;
    },

    // print item into the UI
    addUIItem: function (type, obj) {
      let html, newItem, parentItem;
      if (type === "inc") {
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        parentItem = DOM.incomeList;
      } else if (type === "exp") {
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        parentItem = DOM.expensesList;
      }

      // insert the object values in the html element
      newItem = html.replace("%id%", obj.id);
      newItem = newItem.replace("%description%", obj.description);
      newItem = newItem.replace("%value%", formatNum(obj.value, type));

      // insert the item into the parent
      document
        .querySelector(parentItem)
        .insertAdjacentHTML("beforeend", newItem);
    },

    // delete UI item
    deleteUIItem: function (id) {
      let item, parent;
      item = document.getElementById(id);
      parent = item.parentNode;
      parent.removeChild(item);
    },

    // clear the input UI fields
    clearUIFields: function () {
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

    // print the budget into the UI
    printUIBudget: function (obj) {
      let type = obj.budget > 0 ? "inc" : "exp";
      document.querySelector(DOM.budgetValue).textContent = formatNum(
        obj.budget,
        type
      );
      document.querySelector(DOM.incomeValue).textContent = formatNum(
        obj.totalInc,
        "inc"
      );
      document.querySelector(DOM.expensesValue).textContent = formatNum(
        obj.totalExp,
        "exp"
      );
      if (obj.percentage > 0) {
        document.querySelector(DOM.percentageValue).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOM.percentageValue).textContent = "-";
      }
    },
    // print the percentages into the UI
    printUIpercentages: function (percentagesAry) {
      let percentagesList = document.querySelectorAll(DOM.itemPercentage);
      let percentages = Array.prototype.slice.call(percentagesList);
      percentages.forEach((item, index) => {
        if (percentagesAry[index] > 0) {
          item.textContent = percentagesAry[index] + "%";
        } else {
          item.textContent = "-";
        }
      });
    },
    printDate: function () {
      let date, month, year;
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      date = new Date();
      month = date.getMonth();
      year = date.getFullYear();
      document.querySelector(DOM.monthTitle).textContent =
        months[month] + " " + year;
    },
  };
})();

/*--------------------------------
 Budget Controller - Module Pattern
--------------------------------*/
let BudgetController = (function () {
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
      this.percentage = -1;
    }

    // calculate the percentage
    calcPercentage(totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
    }

    // get the percentage
    get getPercentage() {
      return this.percentage;
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

  // calculate total income or expenses
  let calcTotal = function (type) {
    data.totalBudget[type] = data.totalItems[type].reduce((sum, item) => {
      return sum + item.value;
    }, 0);
  };

  // calculate the final budget
  let calcBudget = function () {
    data.budget = data.totalBudget.inc - data.totalBudget.exp;
  };

  // calculate the percentage
  let calcTotalPercentage = function () {
    if (data.totalBudget.inc > 0) {
      data.percentage = Math.round(
        (data.totalBudget.exp / data.totalBudget.inc) * 100
      );
    } else {
      data.percentage = -1;
    }
  };

  return {
    // add an item to the data structure
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
    // delete an item from the data structure
    deleteInput: function (type, id) {
      let index;

      index = data.totalItems[type].findIndex((value) => {
        return value.id === id;
      });
      if (index !== -1) {
        data.totalItems[type].splice(index, 1);
      }
    },
    // calculate the budget
    calculateBudget: function () {
      // calculate total income and expenses
      calcTotal("inc");
      calcTotal("exp");
      // calculate the final budget
      calcBudget();
      // calculate the percentage
      calcTotalPercentage();
    },

    // calculate all the expense percentages
    calcPercentages: function () {
      data.totalItems.exp.forEach((item) => {
        item.calcPercentage(data.totalBudget.inc);
      });
    },

    // get all the expense percentages
    getPercentages: function () {
      let percentages = data.totalItems.exp.map((item) => {
        return item.getPercentage;
      });
      return percentages;
    },
    // get the data
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
/*--------------------------------
 App Controller - Module Pattern
--------------------------------*/
let appController = (function (UICtrl, BudgetCntrl) {
  // add the item to the data structure and UI
  let addItemCtrl = function () {
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
      UICtrl.addUIItem(inputs.inputType, addInput);

      // clear the fields
      UICtrl.clearUIFields();

      // calculate the budget
      updateBudget();

      // update the percentages
      updatePercentages();
    }
  };

  // delete the item from the data structure and UI
  let deleteItemCtrl = function (event) {
    let item, splitedId, itemId, type, id;

    // get the target item and the id
    item = event.target.parentNode.parentNode.parentNode.parentNode;
    itemId = item.id;
    if (itemId) {
      splitedId = itemId.split("-");
      type = splitedId[0];
      id = parseInt(splitedId[1]);

      // delete the item from tha data
      BudgetCntrl.deleteInput(type, id);

      // delete the item from the UI
      UICtrl.deleteUIItem(itemId);

      // update the budget
      updateBudget();

      // update the percentages
      updatePercentages();
    }
  };

  // add event listeners
  let addEventListeners = function () {
    let DOM = UICtrl.getDOM();
    document.querySelector(DOM.inputBtn).addEventListener("click", addItemCtrl);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        addItemCtrl();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", deleteItemCtrl);
  };

  // update the budget into the data structure and the UI
  let updateBudget = function () {
    // calculate the budget
    BudgetCntrl.calculateBudget();
    // get the budget data
    let budget = BudgetCntrl.getData();

    // add the total budget to the UI
    UICtrl.printUIBudget(budget);
  };

  let updatePercentages = function () {
    let percentages;

    // calculate all the expense percentages
    BudgetCntrl.calcPercentages();

    // get all the expense percentages
    percentages = BudgetCntrl.getPercentages();

    // display the percentages into the UI
    // console.log(percentages);
    UICtrl.printUIpercentages(percentages);
  };

  return {
    init: function () {
      UICtrl.printDate();
      updateBudget();
      addEventListeners();
    },
  };
})(UIController, BudgetController);

appController.init();
