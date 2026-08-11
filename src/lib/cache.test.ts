import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LruCache } from './cache';

test('returns undefined for a missing key', () => {
  const cache = new LruCache<string, string>(2);
  assert.equal(cache.get('missing'), undefined);
});

test('returns a value that was set', () => {
  const cache = new LruCache<string, string>(2);
  cache.set('a', '1');
  assert.equal(cache.get('a'), '1');
});

test('evicts the least recently used entry once over capacity', () => {
  const cache = new LruCache<string, string>(2);
  cache.set('a', '1');
  cache.set('b', '2');
  cache.set('c', '3'); // capacity 2 -> 'a' evicted
  assert.equal(cache.get('a'), undefined);
  assert.equal(cache.get('b'), '2');
  assert.equal(cache.get('c'), '3');
});

test('a get() refreshes recency, protecting the entry from eviction', () => {
  const cache = new LruCache<string, string>(2);
  cache.set('a', '1');
  cache.set('b', '2');
  cache.get('a'); // 'a' is now most-recently-used
  cache.set('c', '3'); // 'b' should be evicted instead of 'a'
  assert.equal(cache.get('a'), '1');
  assert.equal(cache.get('b'), undefined);
  assert.equal(cache.get('c'), '3');
});
