;(function(){
  function Line(params){
    this._hash = T.genKey();
    this.id = 'Line-' + this._hash;
    this.from = params.from || '';
    this.to = params.to || '';
    this.start = params.start || '';
    this.end = params.end || '';

    this.lines = {
      'length':0
    }
    // console.log(params)

    this.draw()
  }

  Line.prototype = {
    constructor: Line,
    draw: function(){
      for(let i in this.lines){
        if(i !== 'length'){
          let {startX, startY, endX, endY} = this.lines[i]
          this.drawLine({ startX, startY, endX, endY })
        }
      }
    },
    transform: function(params){
      console.log(params);
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

      ctx.moveTo(startX, startY)
      ctx.lineTo( (xB1 +xB2 + 2*startX)/2, (yB1+yB2)/2 )
      ctx.lineTo( xB1 + startX, yB1 )
      ctx.lineTo( endX, endY )
      ctx.lineTo( xB2 + startX, yB2 )
      ctx.lineTo( (xB1 + xB2 + 2*startX)/2, (yB1+yB2)/2 )
    },
    addLine: function(params){
      let {id, start, end, from, to} = params;
      let line = {}
      line.id = id;
      line.startX = start.x; 
      line.startY = start.y; 
      line.endX = end.x;
      line.endY = end.y; 
      line.from = from;
      line.to = to;

      !this.lines[line.id] && (this.lines.length += 1);
      this.lines[line.id] = line;
    },
    drawLine: function(params){
      ctx.beginPath()
      this.linePath(params)
      ctx.stroke()
      ctx.closePath()
    },
    transformLine: function(params){
      let { line, start, to } = params;
      this.lines[line.id].startX = start.x;
      this.lines[line.id].startY = start.y;
      this.lines[line.id].endX = to.x;
      this.lines[line.id].endY = to.y;
    }
  }


  window.Line = Line;
})(utils, T);