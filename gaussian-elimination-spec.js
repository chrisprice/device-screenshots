define(['gaussian-elimination'], function(ge) {
  var actual = ge([
    [0, -4, 9, 4, 35],
    [2, 6, -1, 3, 23],
    [3, -5, 8, 2, 25],
    [1, -7, 2, -1, -11]
  ]);
  var expected = [1,2,3,4];
  console.log(
      Math.abs(actual[0] - expected[0]) < 0.0001,
      Math.abs(actual[1] - expected[1]) < 0.0001,
      Math.abs(actual[2] - expected[2]) < 0.0001,
      Math.abs(actual[3] - expected[3]) < 0.0001
  );
});