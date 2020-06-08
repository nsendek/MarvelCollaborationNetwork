const NODE_COLOR = "#00b7ebaa";
const NODE_FOCUSED = "#6f2da8";

function offclick() {
  d3.select('#offclick').append('rect')
    .style('opacity', 0)
    .attr('width', width)
    .attr('height', height)
    .on('click', () => {
      d3.select("#hero_list").selectAll("*").remove();
    }); 
}

function GlobalNetwork() {
  if (state.simulation) state.simulation.stop();
  d3.select('#nodes').selectAll("*").remove();
  d3.select('#links').selectAll("*").remove();
  state.localNodes.clear();
  state.localLinks.clear();
   
  d3.select('#nodes')
    .selectAll('circle')
    .data(state.allNodes)
    .enter()
    .append('circle')
    .attr('id', d =>  `h${d.id}`)
    .attr('cx', d => d.pos.x)
    .attr('cy', d => d.pos.y)
    .attr('r', d => d.getRadius())
    .attr("data-tippy-content", d => d.name)
    .attr('fill',  NODE_COLOR)
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .on('click', handleClick);

    updateNodes();

    if (state.transform) {
      zoomSVG(state.transform);
    }

    tippy('[data-tippy-content]',  {
      theme : 'noPointer'
    });
}

function LocalNetwork() {
  d3.select('#nodes').selectAll("*").remove();
  d3.select('#links').selectAll("*").remove();
  
  state.newSim(); 
  createLocalNetwork();
}

function createLocalNetwork() {
  let svg = d3.select('#network');
  state.localLinkSelection = svg.select("#links")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6) 
      .selectAll("line")
      .remove()
      .data(Array.from(state.localLinks))
      .enter().append("line")
      .attr('id', d =>  `h${d.id}`)
      .attr("stroke-width", 2)
      .attr("data-micromodal-open", "info-modal")
      .on('click', d => {
        handleLinkClick(d);
      })
      .on('mouseover', (d) => d3.select(`#h${d.id}`).attr('stroke','red').attr("stroke-width", 4))
      .on('mouseout', (d) => d3.select(`#h${d.id}`).attr('stroke',"#999").attr("stroke-width", 2));
  
  state.localNodeSelection = svg.select("#nodes")
      .selectAll("circle")
      .remove()
      .data(Array.from(state.localNodes))
      .enter().append("circle")
      .attr('id', d =>  `h${d.id}`)
      .attr('stroke-width', 2)
      .attr('stroke', d => state.selectedHeroes.has(d) ? NODE_FOCUSED : null)
      .attr('r', d => d.getRadius())
      .attr("data-tippy-content", d => d.name)
      .attr('fill', NODE_COLOR)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', handleClick)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

  state.simulation.on("tick", () => {
        state.localLinkSelection
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        state.localNodeSelection
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
      });
  
  tippy('[data-tippy-content]',  {
        theme : 'noPointer'
  });

  // re-init modal for new link svg elements. for some stupid reason  
  // micromodal only hosts one modal  at a time despite lying about  it
  MicroModal.init({
    awaitCloseAnimation: true,
    openTrigger: 'data-micromodal-open',
    closeTrigger: 'data-micromodal-close',
  });

}

function dragstarted() {
  if (!d3.event.active) state.simulation.alphaTarget(0.3).restart();
  d3.select(this).raise();
}

function handleLinkClick(link) {
  let header = d3.select("#info-modal").select('header');
  let main = d3.select("#info-modal").select('main');
  main.selectAll("*").remove();
  header.selectAll("*").remove();
  let comics = link.comicsInRange();

  header.append("h2")
  .attr('class', "modal__title")
  .attr('id',"pairing")
  .html(`<strong>${link.source.name} and ${link.target.name}</strong>`);

  header.append('p')
  .attr('class', "modal__title")
  .attr('id',"count")
  .text(`Total Comics: ${comics.length}`);

  comics.forEach(comic => {
    let section = main.append('div').style('display','flex').style('padding-top','10px');
    let url = comic.thumbnail.path + "/portrait_fantastic." + comic.thumbnail.extension;
    section.append('img').attr('src',url);
    let info = section.append('div').style('padding-left','10px');
    info.append('p').text(comic.title);
    info.append('p').text(d3.timeFormat("%B %d, %Y")(comic.low*1000));
  });
}

function dragged(d) {
  // if (state.transform) {
  //   d.fx = d3.event.x*state.transform.k - state.transform.x;
  //   d.fy = d3.event.y/state.transform.k - state.transform.y;
  // } else {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
  // }
}

function dragended(d) {
  if (!d3.event.active) state.simulation.alphaTarget(0);
  d.x = d.fx ? d.fx : d.x;
  d.y = d.fy ? d.fy : d.y;
  d.fx = null;
  d.fy = null;
}

function updateNodes() {
    let allNodes = d3.select('#nodes').selectAll('circle');
    allNodes.attr('visibility', d => tree.heroSet.has(d) ? 'visible' : 'hidden');      
}

function handleMouseOver(d) {
  state.hover(d);
  d3.select(`#h${d.id}`)
    .transition()
    .attr('r', d => 1.5*d.getRadius())
    .attr( 'fill', NODE_FOCUSED);
}

function handleMouseOut(d,i) {
  state.hover(null);
  d3.select(`#h${d.id}`)
      .transition()
      .attr('r', d => d.getRadius())
      .attr( 'fill', NODE_COLOR);
}

function handleClick(d,i) {
  if (state.selectedHeroes.has(d)) {
    state.deselect(d);
  } else { 
    state.select(d);
  }

  if(state.displayMode == 'local') {
    state.updateLocalNet();
    LocalNetwork();
  } else {
    GlobalNetwork();
  }
}