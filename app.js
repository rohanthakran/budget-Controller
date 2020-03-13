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
    return {
      adddItem : function(type, des, val){
        var newItem, ID;
        if(data.allItem[type].length > 0){
        ID = data.allItem[type][data.allItem[type].length - 1].id +1;
        }
        else{
          ID=0;
        }
        if(type === 'exp'){
             newItem = new Expense(ID,des, val);
        }
        else if( type === 'inc'){
          newItem = new Income(ID, des, val);
        }
        data.allItem[type].push(newItem);
        return newItem;
            },
            testing:function(){
              console.log(data);
            }
    };
    
  })();



//UI controller
var UIController = (function(){
      
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description' ,
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
    addListItem : function(obj, type ){

      var newHtml;
      // Create an html string with placeholder text
      if(type ==='inc'){  
      
      var html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
  else if(type === 'exp'){
        
     var html=  '<div class="item clearfix" id="expense-0"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
  }
      //replace the placeholder text with some actual data 

      newHtml =html.replace('%id')

      //insewrt the html into the DOM

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

            var newItem, input;
           //1. Get the field input data
         
         
           input = UiCtrl.getInput();
          console.log(input);

         newItem = budgetCntrl.adddItem(input.type, input.description, input.value);
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
