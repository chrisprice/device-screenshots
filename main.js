define(["renderer", "projection-solver", "sylvester"], function(Renderer, solveProjection, sylvester) {


  var a1 = [0, 1136-0];
  var a2 = [404, 1848-650];

  var b1 = [640, 1136-0];
  var b2 = [896, 1848-354];

  var c1 = [0, 1136-1136];
  var c2 = [1219, 1848-1293];

  var d1 = [640, 1136-1136];
  var d2 = [1721, 1848-910];

  var renderer = new Renderer(document.getElementById('scene'), solveProjection(a1, a2, b1, b2, c1, c2, d1, d2));
  var background = new Image();
  background.onload = function() {
    renderer.backgroundImage = background;
    var screenshot = new Image();
    screenshot.onload = function() {
      renderer.screenshotImage = screenshot;
      setInterval(function() {
        renderer.render();
      }, 100)
    };
    screenshot.src = "SearchResults.png";
  };
  background.src = "8074156745_3fc93aa1cf_o.jpg";


//  function updateTransformMatrix() {
//
//    var projectionMatrix = solveProjection(a1, a2, b1, b2, c1, c2, d1, d2);
//
//    var transformMatrix = new WebKitCSSMatrix();
//
//    transformMatrix.m11 = projectionMatrix[0][0];
//    transformMatrix.m12 = projectionMatrix[0][1];
//    transformMatrix.m13 = projectionMatrix[0][2];
//    transformMatrix.m14 = projectionMatrix[0][3];
//
//    transformMatrix.m21 = projectionMatrix[1][0];
//    transformMatrix.m22 = projectionMatrix[1][1];
//    transformMatrix.m23 = projectionMatrix[1][2];
//    transformMatrix.m24 = projectionMatrix[1][3];
//
//    transformMatrix.m31 = projectionMatrix[2][0];
//    transformMatrix.m32 = projectionMatrix[2][1];
//    transformMatrix.m33 = projectionMatrix[2][2];
//    transformMatrix.m34 = projectionMatrix[2][3];
//
//    transformMatrix.m41 = projectionMatrix[3][0];
//    transformMatrix.m42 = projectionMatrix[3][1];
//    transformMatrix.m43 = projectionMatrix[3][2];
//    transformMatrix.m44 = projectionMatrix[3][3];
//
//    document.getElementById("screenshot").style.webkitTransform = transformMatrix;
//  }

//  document.body.addEventListener("click", function(e) {
//    var clickVector = sylvester.V([e.offsetX, e.offsetY]);
//    var minDistance = Infinity, minPoint = null;
//    [a2, b2, c2, d2].forEach(function(point) {
//      var distance = sylvester.V(point).distanceFrom(clickVector);
//      if (distance < minDistance) {
//        minDistance = distance;
//        minPoint = point;
//      }
//    });
//    if (minPoint) {
//      minPoint[0] = clickVector.elements[0];
//      minPoint[1] = clickVector.elements[1];
//    }
//
//    updateTransformMatrix();
//  });

});