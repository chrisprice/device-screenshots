define(["sylvester"], function(sylvester) {
// compute solution to system of linear equations
  return function(a, b) {
//    var rowCount = a.length;
    var matrix = sylvester.M(a);
    var vector = sylvester.V(b);
    var augmentedMatrix = matrix.augment(vector);
    var rightTriangularMatrix = augmentedMatrix.toRightTriangular();

    var result = [];

    for (var i = rightTriangularMatrix.rows() - 1; i >= 0; i--) {
      var row = rightTriangularMatrix.row(i + 1).elements,
          sum = 0;
      for (var j = i + 1; j < row.length - 1; j++) {
        sum += row[j] * result[j];
      }
      result[i] = (row[row.length - 1] - sum) / row[i];
    }

    return result;
  }
});