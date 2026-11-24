// Queue (FIFO) - array based
class Queue {
  constructor() { this.items = []; }
  enqueue(p) { this.items.push(p); }              // O(1)
  dequeue() { return this.items.shift(); }        // front se nikalo
  peek() { return this.items[0]; }                // O(1)
  isEmpty() { return this.items.length === 0; }
  size() { return this.items.length; }
  indexOf(p) { return this.items.indexOf(p); }
  insertAt(i, p) { this.items.splice(i, 0, p); }  // undo ke liye
  removeAt(i) { return this.items.splice(i, 1)[0]; } // cancel/skip ke liye
  toArray() { return [...this.items]; }
}
