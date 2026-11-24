// Priority Queue = priority levels, har level ki apni Queue.
// dequeue: sabse high priority wali non-empty queue se nikalo.
class PriorityQueue {
  constructor(levels) {            // levels: high -> low
    this.levels = levels;
    this.queues = {};
    levels.forEach(l => (this.queues[l] = new Queue()));
  }
  enqueue(p) { this.queues[p.category].enqueue(p); }
  dequeue() {
    for (const l of this.levels) {
      if (!this.queues[l].isEmpty()) return this.queues[l].dequeue();
    }
    return null;
  }
  peek() {
    for (const l of this.levels) {
      if (!this.queues[l].isEmpty()) return this.queues[l].peek();
    }
    return null;
  }
  size() { return this.levels.reduce((n, l) => n + this.queues[l].size(), 0); }
}
