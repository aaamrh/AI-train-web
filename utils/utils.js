/*
 * @ Author: marh
 * @ Create Data: 2018-10-10
 * @ Updated Date: 2019-06-09
 * @ Version: 1.2.0
 * 
 * 添加了 bindEvent 以及 fireEvent 方法
*/

// import './utils.css'
const utils = (function(){
    return {
        assert: function(value, desc){
            var li = document.createElement('li');
            li.className = value ? "pass" : "fail";
            li.innerHTML = desc;
            document.getElementById('j-assert').appendChild(li);
        },
        html2node: function(str) {
            var container = document.createElement('div');
            container.innerHTML = str;
            return container.children[0];
        },
        addClass: function (node, className){
            var current = node.className || "";
            if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
              node.className = current ? ( current + " " + className ) : className;
            }
          },
        delClass: function (node, className){
            var current = node.className || "";
            node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
        },
        extend: function(father, child){
            for(let attr in father){
                child[attr] = father[attr]
            }
        },
        bindEvent: function(obj, ev, fn){  
            obj.events = obj.events || {};
            obj.events[ev] = obj.events[ev] || [];
      
            obj.events[ev].push(fn);
      
            if(obj.addEventListener){
              obj.addEventListener(events, fn, false)
            }else{
              obj.attachEvent('on'+events, fn)
            }
        },
        fireEvent: function(obj, events){    
            for(var i=0; i<obj.listener[events].length; i++){
              obj.listener[events][i]()
            }
        },
        isEmptyObj: function(o){
            let str = JSON.stringify(o)
            return str == '{}'
        }
    }
})();

// export default utils;