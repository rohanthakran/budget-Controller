//Budget Controller 
var budgetController = (function(){
   
    var Expense = function (id, description, value) {

      this.id = id;
      this.description = description;
      this.value = value;
      
    };

    var Income = function (id,description, value) {

      this.id = id;
      this.description = description;
      this.value = value;
      
    };


     var data = {
       allItem: {
         exp: [],
         inc : []
       },
       totals : {
         exp : 0,
         inc : 0
       }
     } 
    
    
  })();



//UI controller
var UIController = (function(){
      
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list'
  };
         
    return{
      getInput: function(){

        return {
          type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOmStrings : function(){
      return DOMstrings;
    }
    
    };
     
})();

var controller = (function(budgetCntrl, UiCtrl){

  var setEventListner = function() {
    document.querySelector(DOM.inputBtn).addEventListener('click', CtrlAddItem);
        document.addEventListener('keypress', function(event){
  
            if(event.keyCode === 13 || event.which === 13)
                    CtrlAddItem();
        });
    
  }

  var DOM = UiCtrl.getDOmStrings();

    var CtrlAddItem = function(){
           //1. Get the field input data
          var input = UiCtrl.getInput();
          console.log(input);
         //2. add Item to the budget controller

         //3 . Add the item to the UI

         //4. Calculate the budget

         //5. Display the budget on the Ui

         console.log("It works");

    };
    return{
      init : function() {

        console.log('Application has started');
        setEventListner();
        
      }
    }

})(budgetController, UIController);

controller.init();