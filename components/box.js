/* 
        2                  3
      ------------------------
   1  | .(圆心角)   (圆心角). | 4
   7  |                      |
      |                      |
      |                      |
      |                      |
      |                      |
   6  |                      | 5
      ------------------------
   8  |                      | 13
      |                      |
   9  | .(圆心角)   (圆心角). | 12
      ------------------------
       10                 11

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


  TODO:  标题, 连接点等。  其他的想出来再添加。
  this.knots = {}
  this.arrow = []

*/

;(function(U,T){
  function Box(params){
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
      ctx.save()
      ctx.beginPath()
      this.boxTopPath()
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      

      // box 下部分
      ctx.beginPath()
      this.boxBottomPath()
      ctx.closePath()
      ctx.fill()
      

      // this.linePath() 

      
      if(this.ishover){
        // 边框
        ctx.beginPath()
        this.borderPath();
        ctx.closePath()
        ctx.stroke()
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
      let {x, y, r, rad1, rad2, name, globalAlpha} = params;
      let fillStyle = '';

      fillStyle = this.knots[name] ? this.knots[name].fillStyle : '#333';

      ctx.globalAlpha = globalAlpha || .5;
      ctx.fillStyle = fillStyle;
      ctx.beginPath()
      ctx.arc(x, y, r, rad1||0, rad2||360)
      ctx.closePath()
      ctx.fill()

      let knot = {}

      knot.name = name;
      knot.x = x;
      knot.y = y;
      knot.r = r;
      knot.fillStyle = fillStyle;

      this.knots[name] = knot
    },
    drawKnot: function(){
      let {x, y, w, topH, bottomH} = this;
      let h = topH + bottomH;
      let r = 4;

      ctx.save()

      this.knotPath({
        x: x+w/2,  
        y: y+r, 
        r: r, 
        name: 'top-knot'
      }) 

      this.knotPath({
        x: x+w-r,  y: y+h/2, r: r, name:'right-knot'
      })

      this.knotPath({
        x: x+w/2, y: y+h-r, r: r, name:'bottom-knot'
      })

      this.knotPath({
        x: x+r, y: y+h/2, r: r, name:'left-knot'
      })
      ctx.restore()
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
    
      ctx.fillStyle = topBg;

      // 左上角弧
      ctx.arc( x + borderRadius, y + borderRadius, borderRadius, T.toRad(-180), T.toRad(-90) )

      // 向右
      ctx.lineTo( x + w - borderRadius, y );

      // 右上角弧
      ctx.arc(x + w - borderRadius, y + borderRadius, borderRadius, T.toRad(-90), 0)

      //向下
      ctx.lineTo(x + w, y + topH);

      // 向左
      ctx.lineTo(x, y + topH);

      // 向上
      ctx.lineTo(x, y + borderRadius)
    },
    boxBottomPath: function(){
      let {x, y, w, topH, bottomH, borderRadius, bottomBg} = this;

      ctx.fillStyle = bottomBg;
      ctx.moveTo(x, y + topH);

      // 向下
      ctx.lineTo(x, y + topH + bottomH - borderRadius)

      // 左下角弧
      ctx.arc( x + borderRadius, y + topH + bottomH - borderRadius, borderRadius, T.toRad(180), T.toRad(90), true)

      // 向右
      ctx.lineTo(x + w - borderRadius, y + topH + bottomH)

      // 右下角弧
      ctx.arc( (x + w - borderRadius), (y + topH + bottomH - borderRadius), borderRadius, T.toRad(90), 0, true)

      // 向上
      ctx.lineTo(x + w, y + topH)
    },
    borderPath: function(){
      let {x, y, w, topH, borderRadius, bottomH} = this

      ctx.arc( x + borderRadius, y + borderRadius, borderRadius, T.toRad(-180), T.toRad(-90) )
      ctx.lineTo( x + w - borderRadius, y );
      ctx.arc(x + w - borderRadius, y + borderRadius, borderRadius, T.toRad(-90), 0)
      ctx.lineTo(x + w, y + topH + bottomH - borderRadius);
      ctx.arc( (x + w - borderRadius), (y + topH + bottomH - borderRadius), borderRadius, 0, T.toRad(90))
      ctx.lineTo(x + borderRadius, y + topH + bottomH);
      ctx.arc( x + borderRadius, y + topH + bottomH - borderRadius, borderRadius, T.toRad(90), T.toRad(180))
      ctx.lineTo(x , y + borderRadius);
    },
    linePath: function(params){
      let {startX, startY, endX, endY} = params
      // A(this.mouse.x, this.mouse.y)  B1(this.mouse.x - 12, 5)  B2(this.mouse.x-12, -5)
      // 旋转后的坐标

      /**                               .  B1
       *                                1 、
       *                                1   、
       *  ==============================1     . A (mos.x, mos.y)  
       *  O(startX, startY)             1   、
       *                                1 、
       *                                .  B2
      */

      let dxA = endX - startX;
      let dyA = endY - startY;
      let lenA = Math.sqrt(dxA**2 + dyA**2)

      let radA = -Math.atan2(dyA, dxA);

      let lenB = Math.sqrt( (lenA-12)**2 + 5**2 );

      let radAB = Math.asin(5/lenB);
      let radB1 = radA + radAB;
      let radB2 = radA - radAB;

      let xB1 = Math.cos(radB1)*lenB;
      let yB1 = startY - Math.sin(radB1)*lenB;

      let xB2 = Math.cos(radB2)*lenB;
      let yB2 = startY - Math.sin(radB2)*lenB;

      ctx.beginPath()
      ctx.moveTo(startX,startY)
      ctx.lineTo( (xB1 +xB2 + 2*startX)/2, (yB1+yB2)/2 )
      ctx.lineTo( xB1 + startX, yB1 )
      ctx.lineTo( endX, endY )
      ctx.lineTo( xB2 + startX, yB2 )
      ctx.lineTo( (xB1 + xB2 + 2*startX)/2, (yB1+yB2)/2 )
      // ctx.fillText(radA +' | '+ radB1 +' | '+ yB1, this.mouse.x, this.mouse.y)
      ctx.stroke()
      ctx.closePath()

      
      // line = {}
      // line.id = 'b';
      // line.startX = 0; 
      // line.startY = 0; 
      // line.endX = 0;
      // line.endY = 0; 

      // !this.lines[line.id] && (this.lines.length += 1);
      // this.lines[line.id] = line;
    },
    drawLine: function(){

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
