//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome) * 100);
        else
            this.percentage = -1;
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;  
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value; 
        });
        data.totals[type] = sum;
    };
        
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        
        totals: {
        exp: 0,
        inc: 0
        },
        
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem : function(type, des, val){
            var newItem, ID;  
            
            //Create new ID
            if(data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else
                ID = 0;
            
            //Create new item based on exp or inc
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            //Push it into our data structure
            data.allItems[type].push(newItem);
            
            //Return new element
            return newItem;
            
        },
        
        deleteItem: function(type, id) {
            var ids, index;
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function() {
            
            //calculate total inc and exp
            calculateTotal('inc');
            calculateTotal('exp');
            
            // calculate budget = inc - exp
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate % of inc spent
            if(data.totals.inc > 0)
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        },
        
        calculatePercentages: function() {
              
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function() {
              
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();  
            });
            return allPerc;
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing: function(){
            console.log(data);
        }
    };
    
})();



//UI CONTROLLER
var UIController = (function() {
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(num, type) {
            var numSplit, int, dec;
          /*
          + or -
          2 decimal places
          commas seperating thousands
          
          2310.4567 -> + 2,310.46
          2000 -> + 2,000
          */
            if(num !== 0) {
                
                num = Math.abs(num);
                num = num.toFixed(2);
            
                numSplit = num.split('.');
            
                int = numSplit[0];
                dec = numSplit[1];
            
                if(int.length > 3)
                    int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3);
            
                return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec; 
            }
            else
                return '0.00';
            
        };
    
    var nodeListForEach = function(list, callback) {
                for(var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }  
            };
    
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type) {
              var html, newHtml;
            //Create HTML string with placeholder text
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            
            //Replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            //Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        deleteListItem: function(selectorID) {
            var el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription+', '+DOMStrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj) {
            var type;
            type = obj.budget > 0 ? 'inc' : 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
            
            
        },
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            
            
            nodeListForEach(fields, function(current, index) {
                if(percentages[index] > 0)
                    current.textContent = percentages[index] + '%';
                else
                    current.textContent = '---';
            });
            
        },
        
        displayMonth: function() {
            
            var now, year, month;
            var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            now = new Date();
            year = now.getFullYear();
            
            month = now.getMonth();
            
            document.querySelector(DOMStrings.dateLabel).textContent =  months[month] + ', ' + year;
        },
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );
            
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
            
        },
        
        getDomStrings: function(){
            return DOMStrings;
        }
    };
})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
        
    var setupEventListeners = function() {
        var DOM = UICtrl.getDomStrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
       
       
        document.addEventListener('keypress', function(event){
           if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();      
           }
               
       });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
        
    };
    
    
    var updateBudget = function() {
        
        //1. Calculate budget
            budgetCtrl.calculateBudget();
        
        //2. Return budget
            var budget = budgetCtrl.getBudget();
        
        //3. Display budget on UI
            UICtrl.displayBudget(budget);   
        
    };
    
    var updatePercentages = function() {
        // calculate %
        budgetCtrl.calculatePercentages();
        
        //read % from budget controller
        var percentages = budgetCtrl.getPercentages();
        
        //update UI
        UICtrl.displayPercentages(percentages);
        
    }; 
    
    var ctrlAddItem = function(){
        var input, newItem;
        //  1. Get input
            input = UICtrl.getinput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        
            //  2. Add item to budgetcontroller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            //  3.Add it to UI
            UICtrl.addListItem(newItem, input.type);
        
            // Clear the fields
            UICtrl.clearFields();
        
            //  4.Calculate and update budget
            updateBudget();
        
            //  5.Calculate and display %s
            updatePercentages();
        
        }
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            
            //split inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            
            //delete item from ui
            UICtrl.deleteListItem(itemID);
            
            //update and show new budget
            updateBudget();
        }
        
    };
    
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();