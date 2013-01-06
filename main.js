define(["renderer", "projection-solver", "sylvester", "jquery"], function(Renderer, solveProjection, sylvester, $) {


  var a1 = [0, 1];
  var a2 = [404, 1848-650];

  var b1 = [1, 1];
  var b2 = [896, 1848-354];

  var c1 = [0, 0];
  var c2 = [1219, 1848-1293];

  var d1 = [1, 0];
  var d2 = [1721, 1848-910];

  var canvas = document.getElementById('scene');
  var renderer = new Renderer(canvas);

  var background = new Image();
  background.onload = function() {
    renderer.backgroundImage = background;
    updateTransformMatrix();
  };
  background.crossOrigin = 'anonymous';
  background.src = "https://lh4.googleusercontent.com/-HoXlwn5rTJA/UG_ounMe6ZI/AAAAAAAABi0/thzIWjZG1Vg/s1600/IMG_20121006_095050.jpg";

  function setScreenshot(src) {
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
    screenshot.src = src;
  }

  setScreenshot("SearchResults.png");


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
    // calculate the position in gl space
    var canvasOffset = $(canvas).offset();
    console.log(e.pageX, canvasOffset.left)
    var relX = e.pageX - canvasOffset.left;
    var relY = e.pageY - canvasOffset.top;
    var clickVector = sylvester.V([relX, canvas.height-relY]);

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
  $(document)
    .mousedown(function(e) {
      mouseButtonDown = true;
      if (moveHandler(e)) {
        e.preventDefault();
      } else {
        mouseButtonDown = false;
      }
    })
    .mouseup(function(e) {
      mouseButtonDown = false;
      currentPoint = null;
    })
    .mousemove(moveHandler)
    .click(function(e) {
      var temp;
      temp = a1, a1 = a2, a2 = temp;
      temp = b1, b1 = b2, b2 = temp;
      temp = c1, c1 = c2, c2 = temp;
      temp = d1, d1 = d2, d2 = temp;
      temp = renderer.backgroundImage, renderer.backgroundImage = renderer.screenshotImage, renderer.screenshotImage = temp;
      updateTransformMatrix();
    })
    .bind("drop", function(e) {
      e.stopPropagation();
      e.preventDefault();

      var imageFiles = [].slice.call(e.originalEvent.dataTransfer.files, 0).filter(function(file) {
        return file.type.match(/image.*/);
      });

      var screenshotFile = imageFiles[0];
      var reader = new FileReader();
      reader.onerror = function(e) {
        alert('Error code: ' + e.target.error.code);
      };
      reader.onload = function(evt) {
        setScreenshot(evt.target.result)
      };
      reader.readAsDataURL(screenshotFile);
    });


  $(canvas)
    .click("click", function(e) {
      e.stopPropagation();
    })
    .bind('dragstart', function(e) {
      var dataURL = canvas.toDataURL();
      e.originalEvent.dataTransfer.setData('DownloadURL', 'image/png:rendered.png:' + dataURL);
    });
});