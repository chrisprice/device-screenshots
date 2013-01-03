define(["sylvester"], function(sylvester) {
// compute solution to system of linear equations
  return function(system) {
    // form an augmented matrix and put into right triangular form
    var matrix = sylvester.M(system).toRightTriangular();
    // back-substitution
    // inspired by http://mysite.verizon.net/res148h4j/javascript/script_gauss_elimination4.html
    var result = [], rowCount = matrix.rows();
    for (var i = rowCount - 1; i >= 0; i--) {
      var row = matrix.elements[i];
      for (var sum = 0, j = i + 1; j < rowCount; j++) {
        sum += row[j] * result[j];
      }
      result[i] = (row[rowCount] - sum) / row[i];
    }
    return result;
  }
});