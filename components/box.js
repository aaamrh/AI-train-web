/* 
      2                      3
    1 ------------------------ 4
    7 | .(圆心角)   (圆心角). |
      |                      |
      |                      |
      |                      |
      |                      |
      |                      |
    6 |                      | 5
      ------------------------
    8 |                      | 13
      |                      |
      | .(圆心角)   (圆心角). | 
    9 ------------------------ 12
      10                     11

  绘制顺序： 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
            7 -> 8 -> 9 -> 10 -> 11 -> 12 -> 13

      圆心角: 画 box 圆角边时的圆心
*/


/* 
  可设置参数
  x             :  box左上角的横坐标。默认 (0,0)
  y             :  box左上角的纵坐标。默认 (0,0)
  w             :  box的宽度。默认 300
  topH          :  顶部box的高度，宽度与box的宽度一致。默认300
  bottomH       :  底部box的高度，宽度与box的宽度一致。默认100
  topBg         :  顶部box的背景颜色，默认 #fff
  bottomBg      :  底部box的背景颜色，默认 #b4b4b4
  borderRadius  :  box的边框弧度。默认 20
  ishover       :  是否是hover状态


  函数参数：
  U: 日常开发常用的函数
  T: 此项目开发常用的函数


  TODO:  标题等。  其他的想出来再添加。
*/

;(function(U,T){
  function Box(params){
    this._hash = params.id ? params.id.split('-')[1] : T.genKey();
    this.id = 'box-' + this._hash;
    this.ctx = params.ctx;
    this.x = params.x || 0;
    this.y = params.y || 0;
    this.w = params.w || 160;
    this.topH = params.topH || 150;
    this.bottomH = params.bottomH || 50;
    this.topBg = params.topBg || '#fff';
    this.bottomBg = params.bottomBg || '#b4b4b4';
    this.borderRadius = params.borderRadius || 0;

    this.knots = {}
    this.lines = {
      'length':0
    }

    // 状态 hover
    this.ishover = false;

    this.draw()
  }
  
  Box.prototype = {
    constructor: Box,
    transform:function(params){
      for(let i in params){  this[i] = params[i] }
    },
    draw: function(){
      // box 上部分
      this.ctx.save()
      this.ctx.beginPath()
      this.boxTopPath()
      this.ctx.closePath()
      this.ctx.fill()
      this.ctx.restore()
      

      // box 下部分
      this.ctx.beginPath()
      this.boxBottomPath()
      this.ctx.closePath()
      this.ctx.fill()
      
      
      if(this.ishover){
        // 边框
        this.ctx.beginPath()
        this.borderPath();
        this.ctx.closePath()
        this.ctx.stroke()
        // 接点
        this.drawKnot();
      }
    },
    isPoint: function(pos){
      // 鼠标是否在box上
      let {x, y} = pos;
      return x>this.x && x<=this.x+this.w && y>this.y && y<= this.topH+this.bottomH+this.y;
    },
    knotPath:  function(params){
      let {id, x, y, r, rad1, rad2, globalAlpha, junction} = params;
      let fillStyle = '';

      fillStyle = this.knots[id] ? this.knots[id].fillStyle : '#333';

      this.ctx.globalAlpha = globalAlpha || .5;
      this.ctx.fillStyle = fillStyle;
      this.ctx.beginPath()
      this.ctx.arc(x, y, r, rad1||0, rad2||360)
      this.ctx.closePath()
      this.ctx.fill()

      let knot = {}

      knot.id = id;
      knot.x = x;
      knot.y = y;
      knot.r = r;
      knot.fillStyle = fillStyle;
      knot.junction = junction;

      this.knots[id] = knot
    },
    drawKnot: function(){
      let {x, y, w, topH, bottomH} = this;
      let h = topH + bottomH;
      let r = 4;

      this.ctx.save()

      this.knotPath({
        id: 'top-knot-' + this._hash,
        x: x+w/2,  
        y: y+r, 
        r: r, 
        junction:{
          x: x+w/2,
          y: y
        }
      }) 

      this.knotPath({
        id: 'right-knot-' + this._hash,
        x: x+w-r,
        y: y+h/2, 
        r: r,
        junction:{
          x:x+w,
          y: y+h/2
        }
      })

      this.knotPath({
        id: 'bottom-knot-' + this._hash,
        x: x+w/2, 
        y: y+h-r, 
        r: r,
        junction:{
          x:x+w/2,
          y: y+h
        }
      })

      this.knotPath({
        id: 'left-knot-' + this._hash,
        x: x+r, 
        y: y+h/2, 
        r: r,
        junction:{
          x: x,
          y: y+h/2
        }
      })
      this.ctx.restore()
    },
    isPointKnot: function(pos){
      // 鼠标是否在连线点上
      let knot = null;
      for(let i in this.knots){
        knot = this.knots[i]
        if( (pos.x - knot.x)**2 + (pos.y - knot.y)**2 <= knot.r**2 ){
          return knot;
        }
      }
      return false;
    },
    boxTopPath: function(){
      let {x, y, w, topH, borderRadius, topBg} = this
    
      this.ctx.fillStyle = topBg;

      // 左上角弧
      this.ctx.arc( x + borderRadius, y + borderRadius, borderRadius, T.toRad(-180), T.toRad(-90) )

      // 向右
      this.ctx.lineTo( x + w - borderRadius, y );

      // 右上角弧
      this.ctx.arc(x + w - borderRadius, y + borderRadius, borderRadius, T.toRad(-90), 0)

      //向下
      this.ctx.lineTo(x + w, y + topH);

      // 向左
      this.ctx.lineTo(x, y + topH);

      // 向上
      this.ctx.lineTo(x, y + borderRadius)
    },
    boxBottomPath: function(){
      let {x, y, w, topH, bottomH, borderRadius, bottomBg} = this;

      this.ctx.fillStyle = bottomBg;
      this.ctx.moveTo(x, y + topH);

      // 向下
      this.ctx.lineTo(x, y + topH + bottomH - borderRadius)

      // 左下角弧
      this.ctx.arc( x + borderRadius, y + topH + bottomH - borderRadius, borderRadius, T.toRad(180), T.toRad(90), true)

      // 向右
      this.ctx.lineTo(x + w - borderRadius, y + topH + bottomH)

      // 右下角弧
      this.ctx.arc( (x + w - borderRadius), (y + topH + bottomH - borderRadius), borderRadius, T.toRad(90), 0, true)

      // 向上
      this.ctx.lineTo(x + w, y + topH)
    },
    borderPath: function(){
      let {x, y, w, topH, borderRadius, bottomH} = this

      this.ctx.arc( x + borderRadius, y + borderRadius, borderRadius, T.toRad(-180), T.toRad(-90) )
      this.ctx.lineTo( x + w - borderRadius, y );
      this.ctx.arc(x + w - borderRadius, y + borderRadius, borderRadius, T.toRad(-90), 0)
      this.ctx.lineTo(x + w, y + topH + bottomH - borderRadius);
      this.ctx.arc( (x + w - borderRadius), (y + topH + bottomH - borderRadius), borderRadius, 0, T.toRad(90))
      this.ctx.lineTo(x + borderRadius, y + topH + bottomH);
      this.ctx.arc( x + borderRadius, y + topH + bottomH - borderRadius, borderRadius, T.toRad(90), T.toRad(180))
      this.ctx.lineTo(x , y + borderRadius);
    },
    addLine: function(params){
      let {id, start, end, from, to} = params;
      let line = {}
      line.id = id;
      line.startX = start.x; 
      line.startY = start.y; 
      // line.startX = start.x; 
      // line.startY = start.y; 
      line.endX = end.x;
      line.endY = end.y; 
      line.from = from;
      line.to = to;

      !this.lines[line.id] && (this.lines.length += 1);
      this.lines[line.id] = line;
    }
  }
  
  function TitleBox(params){
    Box.call(this, params)
  }


  // 类式继承
  function A(){}
  A.prototype = Box.prototype;
  TitleBox.prototype = new A({});
  TitleBox.prototype.constructor = TitleBox;

  TitleBox.prototype.say = function(){
    document.title = this.title
  }

  
  // utils.extend(Box.prototype, TitleBox.prototype)


  window.Box = Box;
  window.TitleBox = TitleBox;
})(utils, T);
