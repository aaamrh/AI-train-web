;(function(){
  function Line(params){
    this._hash = params.id ? params.id.split('-')[1] : T.genKey();
    this.id = 'Line-' + this._hash;
    this.ctx = params.ctx;
    this.from = params.from || '';
    this.to = params.to || '';
    this.start = params.start || '';
    this.end = params.end || '';

    this.draw()
  }

  Line.prototype = {
    constructor: Line,
    draw: function(){
      startX = this.start.x
      startY = this.start.y
      endX = this.end.x
      endY = this.end.y
      this.drawLine({ startX, startY, endX, endY })
    },
    linePath: function(params){
      let {startX, startY, endX, endY} = params
      // A(this.mouse.x, this.mouse.y)  B1(this.mouse.x - 12, 5)  B2(this.mouse.x-12, -5)
      // 求旋转后的坐标

      /**                               .  B1
       *                                1 、
       *                                1   、
       *  ==============================1     - A (mos.x, mos.y)  
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

      this.ctx.moveTo(startX, startY)
      this.ctx.lineTo( (xB1 +xB2 + 2*startX)/2, (yB1+yB2)/2 )
      this.ctx.lineTo( xB1 + startX, yB1 )
      this.ctx.lineTo( endX, endY )
      this.ctx.lineTo( xB2 + startX, yB2 )
      this.ctx.lineTo( (xB1 + xB2 + 2*startX)/2, (yB1+yB2)/2 )
    },
    drawLine: function(params){
      this.ctx.beginPath()
      this.linePath(params)
      this.ctx.stroke()
      this.ctx.closePath()
    },
    transform: function(params){
      let { start, to } = params;
      this.start.x = start.x;
      this.start.y = start.y;
      this.end.x = to.x;
      this.end.y = to.y;
    }
  }


  window.Line = Line;
})(utils, T);