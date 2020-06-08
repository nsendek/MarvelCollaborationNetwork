class SubIntervalTree {
  constructor(){
    this.root = null;
    this.linkSet = new Set();   
    this.comicSet = new Set();
    this.heroSet = new Set();
  }
  
  insert(node) {
    if (this.root) {
      attachNode(this.root,node);
    } else {
      this.root = node;
    }
  }
  
  size() {
     let stack = [this.root];
     let count = 0;
     while (stack.length > 0) {
       let n = stack.pop();
       count += 1;
       if (n.right) {
        stack.push(n.right);
       }
       if (n.left) {
        stack.push(n.left);
       }
     }
     return count;
  }

  balance() {
   //balance tree
   let nodes = [];
   BSTarray(this.root,nodes);
   this.root = buildBalanced(nodes, 0, nodes.length-1);
   this.root.setMax();
  }
  
  setInterval(interval) {
   this.find(interval);
  }
  
  find(interval) { 
    this.linkSet.clear();   
    this.comicSet.clear();
    this.heroSet.clear();
    let stack = [this.root];
    while (stack.length > 0) {
      let node = stack.pop();
      if (node.intersect(interval)) {
        this.comicSet.add(node); 
        node.links.forEach(e => {this.linkSet.add(e);});
      }
      //ignore left if max_value < interval[0]
      if (node.left && node.left.max >= interval.low) {
         stack.push(node.left);
      }//ignore right if min_value > interval[1]
      if (node.right && node.low <= interval.high) {
         stack.push(node.right);
      }
    }
    
    this.linkSet.forEach( e => {
      this.heroSet.add(e.source);
      this.heroSet.add(e.target);
    });
  }
}

function BSTarray(node,array) {
  if (!node) {
   return; 
  }
  
  BSTarray(node.left,array);
  array.push(node);
  BSTarray(node.right,array);
}

function attachNode(root,node) {
  let val;
  if (root.compare(node) == -1) {
    if(root.left) {    
      val = attachNode(root.left, node);
    } else {
      root.left = node;
      val = node.max;
    }
  } else {
    if(root.right) {    
      val = attachNode(root.right, node);
    } else {
      root.right = node;
      val = node.max;
    }
  }
  root.max = (val > root.max) ? val : root.max;
  return root.max;
}

function buildBalanced(nodes, start, end) {
  if ( start > end) {
    return;
  }
  let mid = int((start + end)/2);
  let parent = nodes[mid];
  parent.left = buildBalanced(nodes, start, mid-1);
  parent.right = buildBalanced(nodes, mid + 1, end);
  return parent;
}
