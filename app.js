// UI Controller - Module Pattern
let UIController = (function () {
  // code
})();

// Budget Controller - Module Pattern
let BudgetController = (function () {
  // code
})();

// App Controller - Module Pattern
let appController = (function (UICntrl, BudgetCntrl) {
  function valueController() {
    console.log("test completed!");
    // get the input value
    // add the input value to the budget controller
    // add the input value to the UI
    // calculate the budget
    // add the total budget to the UI
  }

  document
    .querySelector(".add__btn")
    .addEventListener("click", valueController);

  document.addEventListener("keypress", function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      valueController();
    }
  });
})(UIController, BudgetController);
