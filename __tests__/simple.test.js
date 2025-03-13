const { describe, it, expect } = require('@jest/globals');

describe('Basic Test Suite', () => {
  it('should pass a simple test', () => {
    expect(2 + 2).toBe(4);
  });
});
