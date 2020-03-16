//Budget Controller 
var budgetController = (function(){
   
    var Expense = function (id, description, value) {

      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = 1;
      
    };

    Expense.prototype.calculatePercentage = function(totalncome){

      if(totalncome > 0){
      
      this.percentage = Math.round((this.value/ totalncome)* 100);
      }
      else{
        this.percentage = -1;
      }
    };

    Expense.prototype.getPercentage = function(){
      return this.percentage;
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
      calculatePercentage : function(){

              data.allItem.exp.forEach(function(cur){

                cur.calculatePercentage(data.totals.inc);
              });


            },
            getPercentages : function(){

              var allperc = data.allItem.exp.map(function(cur){
                return cur.getPercentage();
              });

              return allperc;
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
    container: '.container',
    expensePerc : '.item__percentage',
    datelabel : '.budget__title--month'

  };
  var formatNumber = function(num, type) {
    var numSplit, int, dec, type;


    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

};

  var nodedListFforEaach = function(list, callback){

    for(var i =0;i <list.length; i++){
      callback(list[i], i);
  }
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
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


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
       
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
        document.querySelector(DOMstrings.percentageLabel).textContent =obj.percentageLabel;

        
        if (obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }

    },
    
    displayPercentage: function(percentage){
        var fields = document.querySelectorAll(DOMstrings.expensePerc); 

      
        nodedListFforEaach(fields, function(current, index){

          if(percentage[index] > 0){

          current.textContent = percentage[index]+ '%';
          }
          else{

            current.textContent = '---';
          }
        });

    },
    displayMonth :  function(){
       var now, year, months;
        var now = new Date();
        console.log(now);

        month = now.getMonth();
        months = ['January', 'February', 'March' , ' April', 'May' , 'June', 'July', 'August', ' September', 'October', 'November', 'December'];
       year = now.getFullYear();
       document.querySelector(DOMstrings.datelabel).textContent = months[month]+ ' '+ year;

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
  };
  var updatePercentage = function(){
      //1.  calculate percentage
        budgetCntrl.calculatePercentage();

      //2. Reaad percentage for, the budget controller
      var per = budgetCntrl.getPercentages();
       
      console.log(per);

        UiCtrl.displayPercentage(per);
      //3. Read the ui wwitth the new message

      
  };

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

         //6, calculate and update the percentage

         updatePercentage();
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

         updatePercentage();

        }
    };
    return{
      init : function() {

        console.log('Application has started');
        UiCtrl.displayMonth();
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
