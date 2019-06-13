let T = {}   // tools

// 获取鼠标在元素上的坐标
T.getMousePos = function(ele){
  let mouse = {x:0, y:0}

  ele.addEventListener('mousemove', (event)=>{
    let ev = event || window.event;
    
    let {pageX, pageY, target} = ev;

    let {left, top} = target.getBoundingClientRect();

    let {x, y} = {x: pageX-left, y: pageY-top}

    mouse.x = x;
    mouse.y = y;
  })
  return mouse;
}

// 角度 -> 弧度
T.toRad = function(angle){
  return angle * Math.PI / 180;
}

// 弧度 -> 角度
T.toAngle = function(rad){
  return rad * 180 / Math.PI
}


T.genKey = function (prefix){
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let len = 6;
  let result = prefix || '';

  for(let i=0; i<len; i++){
    result += str[ Math.floor(Math.random()*str.length) ]
  }

  return result;
} 
