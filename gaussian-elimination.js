define(function() {
// convert matrix [A] to upper diagonal form
  function eliminate(A, N) {
    var i, j, k;

    for (i = 0; i < N; i++)
    {
      // find row with maximum in column i
      var max_row = i;
      for (j = i; j < N; j++)
      {
        if (Math.abs(A[j][i]) > Math.abs(A[max_row][i]))
          max_row = j;
      }

      // swap max row with row i of [A:y]
      for (k = i; k < N + 1; k++)
      {
        var tmp       = A[i][k];
        A[i][k]       = A[max_row][k];
        A[max_row][k] = tmp;
      }

      // eliminate lower diagonal elements of [A]
      for (j = i + 1; j < N; j++)
      {
        for (k = N; k > i; k--)
        {
          if (A[i][i] == 0.0)
            return false;
          else
            A[j][k] = A[j][k] - A[i][k]*A[j][i]/A[i][i];
        }
      }
    }

    return true;
  }

// compute the values of vector x starting from the bottom
  function substitute(A, N) {
    var X = [], j, k;

    for (j = N - 1; j >= 0; j--)
    {
      var sum = 0.0;
      for (k = j+1; k < N; k++)
        sum += A[j][k]*X[k];

      X[j] = (A[j][N] - sum)/A[j][j];
    }

    return X;
  }


// compute solution to system of linear equations
  return function(A, N) {
    // check for valid input
    if (isNaN(A[0][0])||isNaN(A[0][1])||isNaN(A[0][2])||isNaN(A[0][3])||isNaN(A[0][4])||
        isNaN(A[1][0])||isNaN(A[1][1])||isNaN(A[1][2])||isNaN(A[1][3])||isNaN(A[1][4])||
        isNaN(A[2][0])||isNaN(A[2][1])||isNaN(A[2][2])||isNaN(A[2][3])||isNaN(A[2][4])||
        isNaN(A[3][0])||isNaN(A[3][1])||isNaN(A[3][2])||isNaN(A[3][3])||isNaN(A[3][4])) {
      throw "Invalid input!";
    }

    // solve using Gaussian elimination with back substitution
    if (eliminate(A, N)) {
      return substitute(A, N);
    }
    else {
      throw "singular matrix!";
    }
  }
});