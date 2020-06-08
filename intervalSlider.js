const intervalWidth = 600;
const intervalHeight = 60;
const step = 5;
const monthYear = d3.timeFormat("%b %Y");
const margin = {top: 10, right: 20, bottom: 20, left: 20};
const x = d3.scaleLinear([UNIXMillis(1938,0,1), UNIXMillis(2021,0,1)], [margin.left, intervalWidth - margin.right]);
const comicCount = [];
const linkCount = [];
var y;
var brush;
var intervalSlider;
var linkAxis;

function makeIntervalSlider() {
  countComics();
  
  intervalSlider = d3.select('#intervalSlider')
      .attr("viewBox", [0, 0, intervalWidth, intervalHeight])
      .attr('width', intervalWidth)
      .attr('height', intervalHeight)
      // .attr('stroke', "#999")
      // .attr('fill', "#999")
      .attr('transform', `translate(${0.5*width} ${550})`); //position
      
  var xAxis = g => g
    .attr("transform", `translate(0,${intervalHeight - margin.bottom})`)
    .attr('stroke', "#999")
    .attr('fill', "#900")
    .call(
      d3.axisBottom(x)
        .ticks(12)
        .tickFormat(d3.timeFormat("%Y")) 
    );
 
  intervalSlider.append("g").attr("id", "intervalPlot")
    .append("path")
      .datum(comicCount)
      .attr("fill", "none")
      .attr("stroke", NODE_FOCUSED)
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x((d,i) => x(UNIXMillis(1940 + step*i,0,1)))
        .y(d => (intervalHeight - y(d))));
 
  let brushed = () => {
          let selection = d3.event.selection;
          if (selection) {
            let sx = selection.map(x.invert);      
            state.updateInterval(sx[0]/1000,sx[1]/1000);
            intervalSlider.select('#axisDate').text(`${monthYear(sx[0])} - ${monthYear(sx[1])}`);
          }
      }
  brush = d3.brushX()
      .extent([[margin.left, margin.top], [intervalWidth - margin.right, intervalHeight - margin.bottom]])
      .on("brush", brushed)
      .on("end", () => {
        if(state.displayMode == 'local') {
          state.updateLocalNet();
          LocalNetwork();
        }
      });;

  intervalSlider.append("g").attr('id', 'intervalBottomAxis')
      .call(xAxis);
  
  intervalSlider.append('text')
      .attr('id', 'axisDate')
      .attr('fill', "#999")
      .attr("x", intervalWidth)
      .attr("y", intervalHeight + margin.bottom + 5)
      .attr('text-anchor','end')
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px");
   
  makeIntervalMarkers();

  intervalSlider.append("g").attr('id','intervalBrush')
      .call(brush)
      .call(brush.move, [UNIXMillis(1938,0,1), UNIXMillis(1938,0,1)].map(x));
}

function makeIntervalMarkers() {
  let markers =  intervalSlider.append('g').attr('id','markers');
  intervalSlider.append('defs');
  let masks = [makeMask('Golden_Age','I'),makeMask('Silver_Age','II'),makeMask('Bronze_Age','III'),makeMask('Modern_Age','IV')];
  let intervals = [GOLDEN_AGE,SILVER_AGE,BRONZE_AGE,MODERN_AGE];

  let scale = 0.75;
  markers.selectAll('path')
    .data(intervals)
    .enter()
    .append('path')
    .attr('d',` 
      M ${0}  ${15} 
      L ${30} ${15}
      L ${15} ${-8}
      L ${0}  ${15}
    `)
    .attr('id' , (d,i) => `${masks[i].node().id}Chevron`)
    .attr('mask', (d,i) => `url(#${masks[i].node().id})`) 
    .style('fill','#999')
    .attr('transform', interval => `translate(${x(interval.low*1000) - 15*scale} ${intervalHeight + 5}) scale(${scale})`)

    markers.selectAll('circle')
    .data(intervals)
    .enter()
    .append('circle')
    .attr('id' , (d,i) => `${masks[i].node().id}Marker`)
    .attr('mask', (d,i) => `url(#${masks[i].node().id})`) 
    .attr("cx", 15).attr("cy", 15).attr('r' , 15)
    .style('fill','#999')
    .attr('transform', interval => `translate(${x(interval.low*1000) - 15*scale} ${intervalHeight + 5}) scale(${scale})`)
    .on('click', interval => {intervalTransition(interval);});



  masks.forEach(  mask => {
    let id = mask.node().id;
    tippy(`#${id}Marker`, {
      content: id.replace("_", " "),
      placement : 'bottom'
    });
  })
}

function makeMask(id,label) {
  let mask = intervalSlider.select('defs').append('mask').attr('id',id);
  mask.append('rect')
    .attr('y', -10)
    .attr('width',30)
    .attr('height',40)
    .attr('fill','white');
  
  mask.append('text')
    .attr('alignment-baseline','central')
    .attr('text-anchor','middle')
    .attr('x',15).attr('y',15)
    .attr("font-family", "serif")
    .attr("font-size", "20px")
    .attr('fill','black')
    .text(label);
    
   return mask;
}

function intervalTransition(interval) {
  intervalSlider.select('#intervalBrush').transition().duration(1500).call(brush.move, [interval.low,interval.high].map(i=> i*1000).map(x));  
}

/**
returns unix time of a date in seconds. 
*/
function UNIX(year,month,day) {
  return Math.round(new Date(year,month,day).getTime()/1000);
}

/**
returns unix time of a date in milliseconds. 
*/
function UNIXMillis(year,month,day) {
  return Math.round(new Date(year,month,day).getTime());
}

/**
call in on init. quickly finds the number of comics in each year 
and saves that data to comicCount.
*/
function countComics() {
  // let maxTime = new Date().getTime();
  for (let i = 1940; i <= 2020; i+= step) {
    let year = new Interval(UNIX(i-step-1,11,31),UNIX(i,0,1));
    tree.setInterval(year);
    comicCount.push(tree.comicSet.size);
  }
  y = d3.scaleLinear([0, max(comicCount)], [margin.bottom, intervalHeight- margin.top]);
}