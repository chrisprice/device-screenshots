define(['gaussian-elimination'], function(solve) {

  var a = [[0, 0], [404, 650]];
  var b = [[640, 0], [896, 354]];
  var c = [[0, 1136], [1219, 1293]];
  var d = [[640, 1136], [1721, 910]];

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

  var projectiveTransformMatrix = [
    [result[0], result[1], result[2]],
    [result[3], result[4], result[5]],
    [result[6], result[7], 1]
  ];

  console.log(projectiveTransformMatrix);
});



