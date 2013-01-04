define(["renderer", "projection-solver", "sylvester"], function(Renderer, solveProjection, sylvester) {


  var a1 = [0, 1136-0];
  var a2 = [404, 1848-650];

  var b1 = [640, 1136-0];
  var b2 = [896, 1848-354];

  var c1 = [0, 1136-1136];
  var c2 = [1219, 1848-1293];

  var d1 = [640, 1136-1136];
  var d2 = [1721, 1848-910];

  var canvas = document.getElementById('scene');
  var renderer = new Renderer(canvas);

  var background = new Image();
  background.onload = function() {
    renderer.backgroundImage = background;
    updateTransformMatrix();
  };
  background.src = "8074156745_3fc93aa1cf_o.jpg";

  var screenshot = new Image();
  screenshot.onload = function() {
    renderer.screenshotImage = screenshot;
    updateTransformMatrix();
  };
  screenshot.src = "SearchResults.png";


  function updateTransformMatrix() {
    renderer.transform = solveProjection(a1, a2, b1, b2, c1, c2, d1, d2);
    renderer.render();
  }
  updateTransformMatrix();

  var mouseButtonDown = false, currentPoint = null;
  function moveHandler(e) {
    if (!mouseButtonDown) {
      return;
    }

    var clickVector = sylvester.V([e.offsetX, 1848-e.offsetY]);
    if (!currentPoint) {
      var minDistance = Infinity;
      [a2, b2, c2, d2].forEach(function(point) {
        var distance = sylvester.V(point).distanceFrom(clickVector);
        if (distance < minDistance) {
          minDistance = distance;
          currentPoint = point;
        }
      });
    }

    currentPoint[0] = clickVector.elements[0];
    currentPoint[1] = clickVector.elements[1];

    updateTransformMatrix();
  }
  document.body.addEventListener("mousedown", function(e) {
    mouseButtonDown = true;
    moveHandler(e);
  });
  document.body.addEventListener("mouseup", function(e) {
    mouseButtonDown = false;
    currentPoint = null;
  });
  document.body.addEventListener("mousemove", moveHandler);
//
//  canvas.addEventListener('dragstart', function(e) {
//    var img = document.createElement("img");
//    img.src = canvas.toDataURL();
//    e.dataTransfer.setData('image/png', img);
//  }, false);
});