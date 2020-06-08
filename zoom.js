function setupZoom(translateExt, scaleExt) {
    d3.select('svg')
      .call(d3.zoom()
      .translateExtent(translateExt ? translateExt : [[-50,-50],[width+50,height+50]])
      .scaleExtent(scaleExt ? scaleExt : [1, 7])
      .on("zoom", zoom)
      .on("end", enhance));
  }

  function zoom() {
    let transform = d3.event.transform;
    zoomSVG(transform);
    zoomCanvas(transform);
  }
  
  function zoomSVG(transform) {
      d3.select("#nodes").selectAll('*').attr("transform", transform);
      if (state.displayMode == 'local') d3.select("#links").selectAll('*').attr("transform", transform);
  }
  
  function zoomCanvas(transform) {
    if (state.transform != transform) {
     state.transform = transform;
     state.needUpdate = true;
    }
  }
  
  function enhance() {
    let transform = d3.event.transform;
    //if (state.transform != transform) {
      fillOffscreenCanvas();
      state.needUpdate = true;
      //console.log('enhance');
    //}
  }