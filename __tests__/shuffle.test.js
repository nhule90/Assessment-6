const shuffle = require("../src/shuffle");

describe("shuffle should...", () => {
  test('return an array', () => {
    let arr=[1,2,3,4,5];
    let returnedArr=shuffle(arr)
    expect(Array.isArray(returnedArr)).toBe(true)
  })
  test('return same length', () => {
    let arr=[1,2,3,4,5];
    let returnedArr=shuffle(arr)
    expect(returnedArr.length).toBe(arr.length)
  })
});
