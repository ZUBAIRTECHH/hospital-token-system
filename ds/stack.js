// Stack (LIFO) - Undo ke liye
class Stack {
  constructor() { this.items = []; }
  push(x) { this.items.push(x); }   // O(1)
  pop() { return this.items.pop(); } // O(1)
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
  size() { return this.items.length; }
}
