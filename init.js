const GOLDEN_AGE = new Interval(UNIX(1938,0,1), UNIX(1956,0,1));
const SILVER_AGE = new Interval(UNIX(1956,0,1), UNIX(1970,0,1));
const BRONZE_AGE = new Interval(UNIX(1970,0,1), UNIX(1985,0,1));
const MODERN_AGE = new Interval(UNIX(1985,0,1), UNIX(2021,0,1));
const tree = new SubIntervalTree();
const state = new GlobalState();

let offscreenCanvas;
let comics;
let heroes;
let links;

function preload() {
  comics = loadJSON("./data/comics.min.json");
  heroes = loadJSON("./data/heroes.min.json");
  links = loadJSON("./data/edges.min.json");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  setupData();
  delete heroes.count;
  delete links.count;
  delete heroes.aspect;
  state.allNodes = Object.values(heroes);
  setupSearch();
  makeIntervalSlider();
  makeSliders();
  makeButtons();

  MicroModal.init({
    awaitCloseAnimation: true,
    openTrigger: 'data-micromodal-open',
    closeTrigger: 'data-micromodal-close',
  });

  setupZoom();
  GlobalNetwork();

  // fillOffscreenCanvas();

  //animate time to GOLDEN_AGE
  intervalTransition(GOLDEN_AGE);

  // d3.select(".track-inset").attr('stroke', "url(#linearGradient) !important");
  // d3.select(".track-inset").attr('stroke', "blue");
  //data structures set, don't need loaded jsons anymore
  comics = null; links = null; heroes = null;

  tippy('[data-tippy-content]');
}

function fillOffscreenCanvas() {
   if (offscreenCanvas) {offscreenCanvas.remove();}
   offscreenCanvas = createGraphics(windowWidth, windowHeight);
   state.linkSetFiltered.forEach( link => {
     let weight = link.comicsInRange().length;
     //let red = map(weight, 0, 50, 255, 0);
     //let blue = map(weight, 0, 50, 0, 255);
  
     let strokeW = map(weight,1,75,0.05,0.5);
     
     offscreenCanvas.stroke(0,0,0,80);
     offscreenCanvas.strokeWeight(state.transform ? strokeW*state.transform.k : strokeW);
     offscreenCanvas.line(
     link.source.pos.x, link.source.pos.y,
     link.target.pos.x, link.target.pos.y
     );
  });
  state.needUpdate=true;
}

function drawLinks() {
  state.linkSetFiltered.forEach( link => {
    let weight = link.comicsInRange().length; 
    //let red = map(weight, 0, 50, 255, 0);
    //let blue = map(weight, 0, 50, 0, 255);
 
    let strokeW = map(weight,1,75,0.05,1);
    
    stroke(153,153,153,50);
    strokeWeight(strokeW);
    line(
    link.source.pos.x, link.source.pos.y,
    link.target.pos.x, link.target.pos.y
    );
 });
}

function draw() {
 if(state.needUpdate) {
    console.log("redraw");
    clear();
    push();
    if (state.transform) {
        translate(state.transform.x, state.transform.y);
        scale(state.transform.k);
    }
   
    if (state.displayMode == 'global') {
      // image(offscreenCanvas, 0, 0, width, height);
      drawLinks();
    }
    pop();
    state.tick();
  }
}

function setupData() {
  Object.keys(comics).forEach( _key => {
      let comic = comics[_key];
      comics[_key] = new ComicInterval(_key, comic.title, comic.interval[0], comic.interval[1], comic.thumbnail);
      tree.insert(comics[_key]);
  });  
  
  Object.keys(heroes).forEach( _key => {
    let hero = heroes[_key];
    if (hero.hasOwnProperty('name')) {
      heroes[_key] = new Node(_key,hero.name, hero.thumbnail, hero.x, hero.y);
    }
  });
  
  Object.keys(links).forEach( _key => {
      let comicIds = links[_key];
      let ids = _key.split("_");
      let nodes = [heroes[ids[0]],heroes[ids[1]]];
      let link = new Link(nodes, comicIds.map(id => comics[id]), _key);

      heroes[ids[0]].addDegree(); heroes[ids[0]].links.add(link);
      heroes[ids[1]].addDegree(); heroes[ids[1]].links.add(link);
  });
  
  tree.balance();
}