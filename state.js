class GlobalState {
  constructor() {
  this.allNodes = null;
  this.hoveredHero = null;
  this.needUpdate = true;
  this.minimumCloseness = 1;
  this.displayMode = 'global';

  this.selectedHeroes = new Set();
  this.linkSetFiltered =new Set();
  
  //local network variables
  this.localNodeSelection = null;
  this.localNodeSelection = null;
  this.localLinks = new Set();
  this.localNodes =  new Set();
  this.maxDepth = 1;
  this.simulation = null;
  }

  tick() {
    this.needUpdate = false;
  }

  toggle(mode) {
    this.needUpdate = true;
    if (mode) {
      this.displayMode = mode;
    } else {
      this.displayMode = (this.displayMode == 'global') ? "local" : 'global';
    }
  }

  updateInterval(low,high) {
    this.needUpdate = true;
    this.currentInterval = new Interval(low,high);
    tree.setInterval(this.currentInterval);
    this.filterLinks();

    if (this.displayMode == 'global') updateNodes();   
  }
  
  setCloseness(val) {
    this.minimumCloseness = val;
  }
  
  filterLinks() {
    this.needUpdate = true;
    this.linkSetFiltered.clear();
    tree.linkSet.forEach( link => {
      if (link.comicsInRange().length >= this.minimumCloseness) {
        this.linkSetFiltered.add(link);
      }
    });
  }

  updateLocalNet() {
    //adjust local network based on closeness, depth, and interval.
    this.localLinks.clear();
    this.localNodes.clear();
    Array.from(this.selectedHeroes).forEach(hero => {
      this.localNodes.add(hero);
      Array.from(hero.links).forEach(link => {
        if (link.comicsInRange().length >= this.minimumCloseness) {
          this.localLinks.add(link);
          this.localNodes.add(link.source == hero ? link.target : link.source);
        }
      })
    })

  }

  newSim() {
    if (this.simulation) this.simulation.stop();
    this.simulation = d3.forceSimulation(Array.from(this.localNodes))
    .force("charge", d3.forceManyBody().strength(-125))
    .force('radi', d3.forceRadial(height/2))
    .force('center', d3.forceCenter(width / 2,height/2))
    .force("link", d3.forceLink(Array.from(this.localLinks)).id(d => d.id).distance(125));    
  }
  
  select(hero) {
    this.needUpdate = true;
    this.selectedHeroes.add(hero);

    if (this.selectedHeroes.size > 0 && this.displayMode == 'global') {
      this.toggle('local');
    }

    if (this.displayMode == 'local') {
      this.localNodes.add(hero);
      Array.from(hero.links).forEach(link => {
        if (link.comicsInRange().length >= this.minimumCloseness) {
          this.localLinks.add(link);
          this.localNodes.add(link.source == hero ? link.target : link.source);
        }
      })
    }
  }
  
  deselect(hero) {
    this.needUpdate = true;
    this.selectedHeroes.delete(hero);

    if (this.selectedHeroes.size == 0 && this.displayMode == 'local') {
      //switch back to local mode?
      this.toggle('global');
      this.localLinks.clear();
      this.localNodes.clear();
    }
  }
  
  hover(hero) {
    this.hoveredHero = hero;
  }
}
