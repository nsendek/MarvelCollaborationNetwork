
function makeButtons() {
d3.select("#buttons").selectAll("*").remove();
let buttons = d3.select("#buttons");
let left = buttons.append('div').attr('id','left');
let right = buttons.append('div').attr('id','right')

right
    .append('div')
    .attr('id','intervalButton')
    .attr('class','visible-button')
    .attr("data-tippy-content", 'Toggle Interval Slider')
    .style('left',`${width - 80}`)
    .style('top',`${550}`)

    .on('click', () => {
        let prevClass = d3.select("#intervalButton").node().classList.value;
        d3.select("#intervalButton")
            .attr('class', prevClass ==  'invisible-button' ? 'visible-button' : 'invisible-button')


        d3.select("#intervalSlider")
            .transition()
            .attr('transform', prevClass ==  'invisible-button' ? `translate(${0.5*width} ${550})` : `translate(${width +  50} ${550})`)
    });

right
    .append('div')
    .attr('id','closenessButton')
    .attr('class','visible-button')
    .attr("data-tippy-content", 'Toggle Closeness Slider')
    .style('left',`${width - 80}`)
    .style('top',`${650}`)
    .on('click', () => {
        let prevClass = d3.select("#closenessButton").node().classList.value;
        d3.select("#closenessButton")
            .attr('class', prevClass ==  'invisible-button' ? 'visible-button' : 'invisible-button')
    
        d3.select("#closenessSlider")
            .transition()
            .attr('transform', prevClass ==  'invisible-button' ? `translate(${0.5*width} ${675})` : `translate(${width + 50} ${675})`)
   
        });

left
    .append('div')
    .attr('id','infoButton')
    .attr('class','info-button')
    .attr("data-tippy-content", 'Information')
    .attr("data-tippy-placement", 'right')
    .attr("data-micromodal-open", "info-modal")
    .attr('class','info-button')
    .on('click', () => {
        d3.select("#info-modal").select('header').html(infoHeader);
        d3.select("#info-modal").select('main').html(infoMain);
    })
    .style('left',`${10}`)
    .style('top',`${10}`);
left
    .append('div')
    .attr('id','randomButton')
    .attr("data-tippy-content", 'Select Random Character')
    .attr('class','random-button')
    .attr("data-tippy-placement", 'right')
    .style('left',`${10}`)
    .style('top',`${120}`)
    .on('click', () => {
        state.select(state.allNodes[Math.floor(Math.random() * state.allNodes.length)]);
        if (state.displayMode == 'local') LocalNetwork();
    });

left
    .append('div')
    .attr('id','resetButton')
    .attr('class','reset-button')
    .attr("data-tippy-content", 'Reset')
    .attr("data-tippy-placement", 'right')
    .style('left',`${10}`)
    .style('top',`${70}`)
    .on('click', () => {
        state.toggle('global');
        state.selectedHeroes.clear();
        GlobalNetwork();
    })
}



let infoHeader = '<h2 class="modal__title" id="modal-1-title"> \
Welcome to the Marvel Collaboration Network \
</h2>';

let infoMain = '<p> \
Data scraped from the <a href = "https://developer.marvel.com">Marvel API</a> \
yielded an overall network of 1,400 nodes (individual characters) and 47,000 unique \
edges (represented by character collaborations within 14,500 comics published \
between 1939 and 2020)\
</p>\
<p>\
This interactive interface lets you set the time period and explore the entire \
collaboration network (<strong>Global Mode</strong>) or search and select specific characters to see their local \
network (<strong>Local Mode</strong>). Use the <strong>Closeness Slider</strong> to specify the minimum number of collaborations \
needed to create an edge between two characters.    \
</p> \
<p>\
In <strong>Global Mode</strong>, explore the entirety of the network topology and \
see how characters naturally collaborate with their neighbors. Click on any hero you find to  \
open Local Mode starting with them!\
</p>\
<p>\
In <strong>Local Mode</strong>, click on neighbors to expand your network graph, and click on edges to open \
up a view of all interactions between characters (within the time period as well)\
</p>';
