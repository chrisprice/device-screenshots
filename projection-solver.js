define(['sylvester','gaussian-elimination'], function(sylvester, solve) {

  var a = [[404, 650], [0, 0]];
  var b = [[896, 354], [640, 0]];
  var c = [[1219, 1293], [0, 1136]];
  var d = [[1721, 910], [640, 1136]];


  function updateTransformMatrix() {
    // [A, B] it will produce a mapping to turn B into A

    // form a linear system using the 4 points and setting t33 = 1
    // taken from http://www.cs.cmu.edu/~ph/869/papers/zisser-mundy.pdf 23.4.7

    var linearSystem = [
      [a[1][0], a[1][1], 1,    0, 0, 0,                -a[0][0]*a[1][0], -a[0][0]*a[1][1],    a[0][0]],
      [0, 0, 0,                a[1][0], a[1][1], 1,    -a[0][1]*a[1][0], -a[0][1]*a[1][1],    a[0][1]],
      [b[1][0], b[1][1], 1,    0, 0, 0,                -b[0][0]*b[1][0], -b[0][0]*b[1][1],    b[0][0]],
      [0, 0, 0,                b[1][0], b[1][1], 1,    -b[0][1]*b[1][0], -b[0][1]*b[1][1],    b[0][1]],
      [c[1][0], c[1][1], 1,    0, 0, 0,                -c[0][0]*c[1][0], -c[0][0]*c[1][1],    c[0][0]],
      [0, 0, 0,                c[1][0], c[1][1], 1,    -c[0][1]*c[1][0], -c[0][1]*c[1][1],    c[0][1]],
      [d[1][0], d[1][1], 1,    0, 0, 0,                -d[0][0]*d[1][0], -d[0][0]*d[1][1],    d[0][0]],
      [0, 0, 0,                d[1][0], d[1][1], 1,    -d[0][1]*d[1][0], -d[0][1]*d[1][1],    d[0][1]]
    ];

    var result = solve(linearSystem);

    var projectiveTransformMatrix = new WebKitCSSMatrix();
    projectiveTransformMatrix.m11 = result[0];
    projectiveTransformMatrix.m12 = result[3];

    projectiveTransformMatrix.m14 = result[6];

    projectiveTransformMatrix.m21 = result[1];
    projectiveTransformMatrix.m22 = result[4];

    projectiveTransformMatrix.m24 = result[7];

    projectiveTransformMatrix.m41 = result[2]; // translate
    projectiveTransformMatrix.m42 = result[5]; // translate

    document.getElementById("screenshot").style.webkitTransform = projectiveTransformMatrix;
  }

  document.body.addEventListener("click", function(e) {
    var clickVector = sylvester.V([e.offsetX, e.offsetY]);
    console.log(clickVector.elements);
    var minDistance = 100, minPoint = null;
    [a, b, c, d].forEach(function(point) {
      var distance = sylvester.V(point[0]).distanceFrom(clickVector);
      console.log(point[0], distance);
      if (distance < minDistance) {
        minDistance = distance;
        minPoint = point;
      }
    });
    if (minPoint) {
      minPoint[0] = clickVector.elements;
    }

    updateTransformMatrix();
  });
});



