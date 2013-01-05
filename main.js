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
      var minDistance = 100;
      [a2, b2, c2, d2].forEach(function(point) {
        var distance = sylvester.V(point).distanceFrom(clickVector);
        if (distance < minDistance) {
          minDistance = distance;
          currentPoint = point;
        }
      });
    }
    if (currentPoint) {
      currentPoint[0] = clickVector.elements[0];
      currentPoint[1] = clickVector.elements[1];
      updateTransformMatrix();
    }
    return !!currentPoint;
  }
  document.body.addEventListener("mousedown", function(e) {
    mouseButtonDown = true;
    if (moveHandler(e)) {
      e.preventDefault();
    } else {
      mouseButtonDown = false;
    }
  });
  document.body.addEventListener("mouseup", function(e) {
    mouseButtonDown = false;
    currentPoint = null;
  });
  document.body.addEventListener("mousemove", moveHandler);

  document.body.addEventListener("drop", function(e) {
    e.stopPropagation();
    e.preventDefault();

    var imageFiles = [].slice.call(e.dataTransfer.files, 0).filter(function(file) {
      return file.type.match(/image.*/);
    });

    var screenshotFile = imageFiles[0];
    var reader = new FileReader();
    reader.onerror = function(e) {
      alert('Error code: ' + e.target.error.code);
    };
    reader.onload = function(evt) {
      var screenshot = new Image();
      screenshot.onload = function() {
        renderer.screenshotImage = screenshot;
        a1[0] = 0;
        a1[1] = screenshot.height;
        b1[0] = screenshot.width;
        b1[1] = screenshot.height;
        c1[0] = 0;
        c1[1] = 0;
        d1[0] = screenshot.width;
        d1[1] = 0;
        updateTransformMatrix();
      };
      screenshot.src = evt.target.result
    };
    reader.readAsDataURL(screenshotFile);
  });

  canvas.addEventListener('dragstart', function(e) {
    var dataURL = canvas.toDataURL();
    e.dataTransfer.setData('DownloadURL', 'image/png:rendered.png:' + dataURL);
  });
});