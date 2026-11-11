import test from 'node:test';
import assert from 'node:assert/strict';
import { mean, median, correlation, sampleGold } from '../src/lib/stats-games.ts';

test('outliers move the mean while median uses the ordered middle', () => {
  const values = [22, 2, 7, 4, 5];
  assert.equal(mean(values), 8);
  assert.equal(median(values), 5);
  assert.deepEqual(values, [22, 2, 7, 4, 5]);
  assert.equal(median([8, 2, 4, 6]), 5);
  assert.equal(mean([1, 2, 4, 5, 7]), 3.8);
});

test('correlation distinguishes positive, negative and nonlinear relationships', () => {
  assert.equal(correlation([1,2,3,4].map(x=>({x,y:x*2}))), 1);
  assert.equal(correlation([1,2,3,4].map(x=>({x,y:10-x}))), -1);
  const curved = [-3,-2,-1,0,1,2,3].map(x=>({x,y:x*x}));
  assert.equal(correlation(curved), 0);
  assert.equal(correlation([{x:1,y:2},{x:2,y:2}]), 0);
});

test('token simulation samples each independent draw against the probability', () => {
  const draws = [0, 0.1, 0.29, 0.3, 0.5, 0.99];
  let index = 0;
  assert.equal(sampleGold(draws.length, 0.3, () => draws[index++]), 3);
  assert.equal(index, 6);
  assert.equal(sampleGold(100, 0, () => 0.5), 0);
  assert.equal(sampleGold(100, 1, () => 0.5), 100);
});
