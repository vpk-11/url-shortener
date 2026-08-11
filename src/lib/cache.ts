// Minimal in-process LRU cache. Map preserves insertion order, so re-inserting
// a key on access (delete + set) keeps it "most recently used" at the tail.
// ponytail: single-process only, resets on restart, no eviction across instances
// -- swap for Redis if the app ever runs multi-instance behind a load balancer.
export class LruCache<K, V> {
  private map = new Map<K, V>();

  constructor(private readonly capacity: number) {}

  get(key: K): V | undefined {
    const value = this.map.get(key);
    if (value === undefined) return undefined;
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest as K);
    }
  }
}
