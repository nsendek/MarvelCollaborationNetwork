// closeness and depth sliders

function makeSliders() {
    d3.select('#sliders')
        .attr('width', 500)
        .attr('height', 100);
    makeClosenessSlider();
    // makeDepthSlider();
}

function makeClosenessSlider() {
    let slider = d3
    .sliderBottom()
    .default(1)
    .min(1)
    .max(50)
    .step(1)
    .width(575)
    .handle(
      d3
        .symbol()
        .type(d3.symbolCircle)
        .size(200)()
    )
    .displayValue(false)
    .on('onchange', val => {
        state.setCloseness(val);
        state.filterLinks();
    })
    .on('end', val => {
      if(state.displayMode == 'local') {
        state.updateLocalNet();
        LocalNetwork();
      }
   });

let gradient = d3.select('#sliders')
.append('defs')
.append("linearGradient")
.attr("id", "linearGradient");

gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color","#F00");
gradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color","#0FF");
gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color","#00F");

// d3.select(".track").attr('stroke',"url(#linear-gradient)");

  d3.select('#sliders')
    .append('g').attr('id','closenessSlider')
    .attr('transform', `translate(${0.5*width} ${675})`)
    .call(slider);
}

function makeDepthSlider() {
    let slider = d3
    .sliderBottom()
    .default(1)
    .min(1)
    .max(10)
    .step(1)
    .width(600)
    .handle(
      d3
        .symbol()
        .type(d3.symbolCircle)
        .size(200)()
    )
    .displayValue(false)
    .on('onchange', val => {
        state.setDepth(val);
    });

  d3.select('#sliders')
    .append('g').attr('id','depthSlider')
    .attr('transform', `translate(${0.5*width} ${725})`)
    .call(slider);
}