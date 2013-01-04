define(['gaussian-elimination'], function(solve) {
  // produce the transform to turn [abcd]1 into [abcd]2
  return function(a1, a2, b1, b2, c1, c2, d1, d2) {
    // form a linear system using the 4 points and setting t33 = 1
    // taken from http://www.cs.cmu.edu/~ph/869/papers/zisser-mundy.pdf 23.4.7
    var linearSystem = [
      [a1[0], a1[1], 1, 0,     0,     0, -a2[0]*a1[0], -a2[0]*a1[1], a2[0]],
      [0,     0,     0, a1[0], a1[1], 1, -a2[1]*a1[0], -a2[1]*a1[1], a2[1]],
      [b1[0], b1[1], 1, 0,     0,     0, -b2[0]*b1[0], -b2[0]*b1[1], b2[0]],
      [0,     0,     0, b1[0], b1[1], 1, -b2[1]*b1[0], -b2[1]*b1[1], b2[1]],
      [c1[0], c1[1], 1, 0,     0,     0, -c2[0]*c1[0], -c2[0]*c1[1], c2[0]],
      [0,     0,     0, c1[0], c1[1], 1, -c2[1]*c1[0], -c2[1]*c1[1], c2[1]],
      [d1[0], d1[1], 1, 0,     0,     0, -d2[0]*d1[0], -d2[0]*d1[1], d2[0]],
      [0,     0,     0, d1[0], d1[1], 1, -d2[1]*d1[0], -d2[1]*d1[1], d2[1]]
    ];

    // solve the system to retrieve the remaining tij values
    var t = solve(linearSystem);

    // transpose the matrix and add a 3rd dimension to make it compatible with
    // the browser based 3d transform matrix
    return [
        [ t[0], t[3], 0, t[6]],
        [ t[1], t[4], 0, t[7]],
        [ 0,    0,    1, 0   ],
        [ t[2], t[5], 0, 1   ]
    ];
  };
});



