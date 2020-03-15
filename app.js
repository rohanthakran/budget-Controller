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

    var calculateTotal = function(type){
      var sum = 0;
      data.allItem[type].forEach(function(cur){
               
        sum = sum+cur.value;

      });
      data.totals[type] = sum;

    };


     var data = {
       allItem: {
         exp: [],
         inc : []
       },
       totals : {
         exp : 0,
         inc : 0
       },
       budget : 0,
       percentage : -1
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

            deleteItem : function(type, id){
              var ids, index;

              ids = data.allItem[type].map(function(current){
                    return current.id;          
              });

              index = ids.indexOf(id);

              if(index !== -1){
                data.allItem[type].splice(index, 1);
              
              }
            },


          calculateBudget: function(tpe, val){
              //calculate total income and expense 
              calculateTotal('exp');
              calculateTotal('inc');

              //calculate the budget income-expenses
              data.budget = data.totals.inc- data.totals.exp;

              // calculate the percentage of income that we 
              if(data.totals.inc>0){
              data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
              }
              else{
                data.percentage = -1;
              }
            },

            getBudget: function(){

              return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage : data.percentage
              };
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
    incomeContainer: '.income__list',
    expensesContainer : '.expenses__list',
    budgetLabel : '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel : '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'

  };
         
    return{
      getInput: function(){

        return {
          type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem : function(obj, type ){
 
      var newHtml;
      // Create an html string with placeholder text
      if(type ==='inc'){  
        element  = DOMstrings.incomeContainer;
      
      var html = '<div class="item clearfix" id="inc-%id"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
  else if(type === 'exp'){
    element = DOMstrings.expensesContainer;
        
     var html=  '<div class="item clearfix" id="exp-%id"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
  }
      //replace the placeholder text with some actual data 

      newHtml = html.replace('%id',obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);


      //insewrt the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      

    },

    deleteListItem : function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },
    clearFields : function(){
     var field, fieldsArray;
      field=  document.querySelectorAll(DOMstrings.inputDescription + ',' +DOMstrings.inputValue);
      
     fieldsArray = Array.prototype.slice.call(field);

     fieldsArray.forEach(function(current, index, array){
       current.value = "";


     });
     fieldsArray[0].focus();
    
    },
    displayBudget : function(obj){
        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expenseLabel).textContent =obj.totalExp;
        document.querySelector(DOMstrings.percentageLabel).textContent =obj.percentageLabel;

        
        if (obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }

    },
    
    getDOmStrings : function(){
      return DOMstrings;
    }
    
    };
     
})();

var controller = (function(budgetCntrl, UiCtrl){
  var DOM = UiCtrl.getDOmStrings();

  var setEventListner = function() {
    document.querySelector(DOM.inputBtn).addEventListener('click', CtrlAddItem);
        document.addEventListener('keypress', function(event){
  
            if(event.keyCode === 13 || event.which === 13)
                    CtrlAddItem();
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    
  };
  var updateBudget = function(){
    //1. Calculate the 
    budgetCntrl.calculateBudget();

    //2. Return the budget
    var budget = budgetCntrl.getBudget();
  

    UiCtrl.displayBudget(budget);


    //3. Display the budget on Ui
  }

  var DOM = UiCtrl.getDOmStrings();

    var CtrlAddItem = function(){

            var newItem, input;
           //1. Get the field input data
         
         
           input = UiCtrl.getInput();
          console.log(input);

      if(input.description !=="" && !isNaN(input.value) && input.value>0){
         newItem = budgetCntrl.adddItem(input.type, input.description, input.value);
         //2. add Item to the budget controller

         //3 . Add the item to the UI
          UiCtrl.addListItem(newItem, input.type);

          // Clear the field
          UiCtrl.clearFields();
         //4. Calculate the budget

         updateBudget();
      } 
    };
    var ctrlDeleteItem = function(event){
      var itemId,splitId, type, ID; 

       itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId){

          splitId = itemId.split('-');

          type =splitId[0];
          ID = parseInt(splitId[1]);

         //1. Delete the Item from the data structure
         budgetCntrl.deleteItem(type,ID);
         
         //2 . Delete the item from the 
         UiCtrl.deleteListItem(itemId); 
         


         //3. Update and show tthe new budget
         updateBudget();

        }
    };
    return{
      init : function() {

        console.log('Application has started');
        UiCtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
        });
        setEventListner();
        
      }
    }

})(budgetController, UIController);

controller.init();
