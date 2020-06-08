const NODE_FLOOR = 3;
const NODE_CEILING = 16;

class Node extends Object {
 constructor(id, n, thumb, x, y) {
   super();
   this.links = new Set();
   this.id = id;
   this.name = n;
   this.thumbnail = thumb;
   this.pos = createVector((0.05*height + 0.9*height*x)/heroes.aspect, (0.05*height + 0.9*height*y));
   this.degree = 0;
 }
 
 addDegree() {
   this.degree += 1;
 }
 
 neighbors(other) {
   let allLinks = new Set([...other.links,...this.links]);
   return allLinks.size != (other.links.size + this.links.size);
 }
 
 getRadius() {
   let rad; 
   rad = map(this.degree, 1, 500, 1, 10);
   rad = max(rad, NODE_FLOOR);
   rad = min(rad, NODE_CEILING);
   return rad;
 }
}

class Link {
 constructor(_nodes, _comics,  id) {
   this.source = _nodes[0];
   this.target = _nodes[1];
   this.id = id;
   this.comics = _comics;
   this.comics.forEach(comic => {
     comic.links.add(this);
   });
 }
 
 comicsInRange() {
    return [...this.comics].filter(x => tree.comicSet.has(x));
 }
}

// class LocalNetwork {
//   constructor() {
//     this.nodes = new Set();
//     this.links = new Set();
//     this.maxDepth = 1;
//   }
//   setDepth(val) {
//     this.maxDepth = val;
//   }

//   updateNodes(_nodes) {
//     this.nodes = _nodes;
//   }

//   updateLinks(_links) {
//     this.links = _links;
//   }
// }