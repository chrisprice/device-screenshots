define(["threejs"], function(THREE) {
  return function(canvas) {
    var SCALE = 1;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    camera.position.z = 800;
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer({
      canvas : canvas,
      antialias: true,
      // fixes blank image when dragging the canvas
      preserveDrawingBuffer: true
    });

    var background = createLayer(0);
    scene.add(background);

    var transform = new THREE.Object3D();
    // STUMBLING BLOCK  https://github.com/mrdoob/three.js/wiki/Using-Matrices-&-Object3Ds-in-THREE
    transform.matrixAutoUpdate = false;
    scene.add(transform);

    var screenshot = createLayer(1);
    transform.add(screenshot);

    !function() {
      var VERTEX_SHADER = [
        "uniform float uZScale;",
        "void main() {",
        "	float z = abs(50.0-position.x) * uZScale;",
        "	gl_Position = projectionMatrix *",
        "		modelViewMatrix *",
        "		vec4(position.x, position.y, z, 1.0);",
        "}"
      ].join("\n");

      var FRAGMENT_SHADER = [
        "void main(void) {",
        "	gl_FragColor = vec4(1,1,0,1);",
        "}"
      ].join("\n");
      var path = transformSVGPath("M88.406,9.826c3.995-1.437,9.531-2.341,11.257,2.671c1.521,4.347-3.097,13.503-4.511,17.66   c-1.938,5.695-3.944,11.463-6.667,16.838c-2.541,4.665-8.027,4.479-12.773,3.834c2.238,1.056,5.379,1.964,7.119,3.842   c2.373,2.263-1.899,1.188,1.818,3.312c1.365,0.78,2.907,1.943,4.011,3.085c2.324,2.406-0.032,2.374-1.229,4.278   c-1.549,2.552,2.425,3.946,3.267,5.604c1.132,3.145-4.121,0.956-4.365,3.622c-0.559,4.73,1.752,6.606,5.486,9.151   c2.233,1.522,7.175,3.635,8.05,6.423c0.985,3.141-3.854,4.646-5.528,2.234c-2.456-3.536-7.743-14.905-13.245-7.511   c-0.861,1.157-1.3,5.096-3.264,1.903c-1.431-2.325-3.086-2.307-4.41,0.324c-2.994,5.946-8.565-8.76-10.064-10.645   c-1.98-2.583-2.893-5.544-4.551-8.305c-1.943-2.974-2.575-9.244-5.916-11.024c-0.971,4.744,3.327,24.369-1.833,26.809   c-2.893-1.827-2.096-8.4-2.039-11.207c0.101-5.025,1.247-11.17-0.388-16.033c-2.478,1.698-3.665,6.183-4.872,8.771   c-1.694,3.635-3.572,7.646-6.013,10.827c-2.411,3.044-6.237,17.258-10.616,9.601c-0.878-1.536-2.771-0.845-3.48,0.317   c-2.681,4.415-2.679-0.459-4.55-2.011c-7.668-6.36-9.583,7.883-14.02,9.514c-2.271,0.875-5.139-1.879-3.418-4.031   c2.329-2.594,5.668-4.22,8.47-6.232c2.296-1.649,5.208-4.143,4.722-7.322c-0.512-3.342-4.737-2.195-4.695-4.473   c0.124-1.964,3.446-2.416,3.736-4.739c0.287-2.301-3.189-2.147-2.615-4.233c1.46-3.896,6.357-3.456,6.755-7.272   c0-2.218,5.522-3.517,6.943-4.455c-3.611,0.403-8.206,1-11.465-1.046c-2.831-1.653-4.338-7.709-5.46-10.522   c-1.986-4.982-3.79-10.047-5.417-15.158c-1.206-3.787-4.724-10.775-0.9-14.024c6.759-5.819,22.126,6.041,26.964,10.475   c7.569,6.937,13.369,15.723,17.027,25.293c1.937-0.968,1.914-8.272,4.958-7.518c2.033,0.712,2.999,4.693,4.114,6.253   C60.693,29.383,72.778,15.569,88.406,9.826C90.44,9.095,85.898,10.748,88.406,9.826z");
      window.material = new THREE.ShaderMaterial({
        vertexShader : VERTEX_SHADER,
        fragmentShader : FRAGMENT_SHADER,
        uniforms: {
          uZScale: {
            type: "f",
            value: 0.01
          }
        }
      });
      var geometry = path.makeGeometry();
//      geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(-50, -50, 0)).rotateAxis(new THREE.Vector3(0, 0, Math.PI)));
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = -90;
      mesh.position.z = 50;
      mesh.rotation.x = 75;
//      mesh.position.y = 100;
      mesh.updateMatrix();
      scene.add( mesh);
    }();

    this.backgroundImage = null;
    this.screenshotImage = null;
    this.transform = null;

    this.render = function() {
      if (background.material.map.image != this.backgroundImage) {
        background.material.map.image = this.backgroundImage;
        background.material.map.needsUpdate = true;

        background.scale.x = this.backgroundImage.width;
        background.scale.y = this.backgroundImage.height;

//        camera.top = this.backgroundImage.height;
//        camera.right = this.backgroundImage.width;
//        camera.updateProjectionMatrix();

        renderer.setSize(this.backgroundImage.width * SCALE, this.backgroundImage.height * SCALE);
      }
      if (screenshot.material.map.image != this.screenshotImage) {
        screenshot.material.map.image = this.screenshotImage;
        // STUMBLING BLOCK https://github.com/mrdoob/three.js/wiki/Using-Matrices-&-Object3Ds-in-THREE
        screenshot.material.map.needsUpdate = true;

        screenshot.scale.x = this.screenshotImage.width;
        screenshot.scale.y = this.screenshotImage.height;
      }

      // update transform
      if (this.transform) {
        transform.matrix.elements = Array.prototype.concat.apply([], this.transform);
        // STUMBLING BLOCK https://github.com/mrdoob/three.js/wiki/Using-Matrices-&-Object3Ds-in-THREE
        transform.matrixWorldNeedsUpdate = true;
      }
      var t = 0;
setInterval(function() {
  window.material.uniforms.uZScale.value = Math.sin(t++/10*2*Math.PI )
  renderer.render(scene, camera);
}, 50)
      renderer.render(scene, camera);
    };

    function createLayer(zIndex, t) {
      var texture = new THREE.Texture();
      var material = new THREE.MeshBasicMaterial({
        map : texture
      });
      var geometry = new THREE.PlaneGeometry(1, 1);
      geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(0.5, 0.5, zIndex)));
      return new THREE.Mesh(geometry, material);
    }
  };


  function transformSVGPath(pathStr) {
    var DEGS_TO_RADS = Math.PI / 180,
      UNIT_SIZE = 100;

    var DIGIT_0 = 48, DIGIT_9 = 57, COMMA = 44, SPACE = 32, PERIOD = 46,
      MINUS = 45;
    var path = new THREE.Shape();

    var idx = 1, len = pathStr.length, activeCmd,
      x = 0, y = 0, nx = 0, ny = 0, firstX = null, firstY = null,
      x1 = 0, x2 = 0, y1 = 0, y2 = 0,
      rx = 0, ry = 0, xar = 0, laf = 0, sf = 0, cx, cy;

    function eatNum() {
      var sidx, c, isFloat = false, s;
      // eat delims
      while (idx < len) {
        c = pathStr.charCodeAt(idx);
        if (c !== COMMA && c !== SPACE)
          break;
        idx++;
      }
      if (c === MINUS)
        sidx = idx++;
      else
        sidx = idx;
      // eat number
      while (idx < len) {
        c = pathStr.charCodeAt(idx);
        if (DIGIT_0 <= c && c <= DIGIT_9) {
          idx++;
          continue;
        }
        else if (c === PERIOD) {
          idx++;
          isFloat = true;
          continue;
        }

        s = pathStr.substring(sidx, idx);
        return isFloat ? parseFloat(s) : parseInt(s);
      }

      s = pathStr.substring(sidx);
      return isFloat ? parseFloat(s) : parseInt(s);
    }

    function nextIsNum() {
      var c;
      // do permanently eat any delims...
      while (idx < len) {
        c = pathStr.charCodeAt(idx);
        if (c !== COMMA && c !== SPACE)
          break;
        idx++;
      }
      c = pathStr.charCodeAt(idx);
      return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));
    }

    var canRepeat;
    activeCmd = pathStr[0];
    while (idx <= len) {
      canRepeat = true;
      console.log(activeCmd);
      switch (activeCmd) {
        // moveto commands, become lineto's if repeated
        case 'M':
          x = eatNum();
          y = eatNum();
          path.moveTo(x, y);
          activeCmd = 'L';
          break;
        case 'm':
          x += eatNum();
          y += eatNum();
          path.moveTo(x, y);
          activeCmd = 'l';
          break;
        case 'Z':
        case 'z':
          canRepeat = false;
          if (x !== firstX || y !== firstY)
            path.lineTo(firstX, firstY);
          break;
        // - lines!
        case 'L':
        case 'H':
        case 'V':
          nx = (activeCmd === 'V') ? x : eatNum();
          ny = (activeCmd === 'H') ? y : eatNum();
          path.lineTo(nx, ny);
          x = nx;
          y = ny;
          break;
        case 'l':
        case 'h':
        case 'v':
          nx = (activeCmd === 'v') ? x : (x + eatNum());
          ny = (activeCmd === 'h') ? y : (y + eatNum());
          path.lineTo(nx, ny);
          x = nx;
          y = ny;
          break;
        // - cubic bezier
        case 'C':
          x1 = eatNum(); y1 = eatNum();
        case 'S':
          if (activeCmd === 'S') {
            x1 = 2 * x - x2; y1 = 2 * y - y2;
          }
          x2 = eatNum();
          y2 = eatNum();
          nx = eatNum();
          ny = eatNum();
          path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
          x = nx; y = ny;
          break;
        case 'c':
          x1 = x + eatNum();
          y1 = y + eatNum();
        case 's':
          if (activeCmd === 's') {
            x1 = 2 * x - x2;
            y1 = 2 * y - y2;
          }
          x2 = x + eatNum();
          y2 = y + eatNum();
          nx = x + eatNum();
          ny = y + eatNum();
          path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
          x = nx; y = ny;
          break;
        // - quadratic bezier
        case 'Q':
          x1 = eatNum(); y1 = eatNum();
        case 'T':
          if (activeCmd === 'T') {
            x1 = 2 * x - x1;
            y1 = 2 * y - y1;
          }
          nx = eatNum();
          ny = eatNum();
          path.quadraticCurveTo(x1, y1, nx, ny);
          x = nx;
          y = ny;
          break;
        case 'q':
          x1 = x + eatNum();
          y1 = y + eatNum();
        case 't':
          if (activeCmd === 't') {
            x1 = 2 * x - x1;
            y1 = 2 * y - y1;
          }
          nx = x + eatNum();
          ny = y + eatNum();
          path.quadraticCurveTo(x1, y1, nx, ny);
          x = nx; y = ny;
          break;
        // - elliptical arc
        case 'A':
          rx = eatNum();
          ry = eatNum();
          xar = eatNum() * DEGS_TO_RADS;
          laf = eatNum();
          sf = eatNum();
          nx = eatNum();
          ny = eatNum();
          if (rx !== ry) {
            console.warn("Forcing elliptical arc to be a circular one :(",
              rx, ry);
          }
          // SVG implementation notes does all the math for us! woo!
          // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
          // step1, using x1 as x1'
          x1 = Math.cos(xar) * (x - nx) / 2 + Math.sin(xar) * (y - ny) / 2;
          y1 = -Math.sin(xar) * (x - nx) / 2 + Math.cos(xar) * (y - ny) / 2;
          // step 2, using x2 as cx'
          var norm = Math.sqrt(
            (rx*rx * ry*ry - rx*rx * y1*y1 - ry*ry * x1*x1) /
              (rx*rx * y1*y1 + ry*ry * x1*x1));
          if (laf === sf)
            norm = -norm;
          x2 = norm * rx * y1 / ry;
          y2 = norm * -ry * x1 / rx;
          // step 3
          cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
          cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;

          var u = new THREE.Vector2(1, 0),
            v = new THREE.Vector2((x1 - x2) / rx,
              (y1 - y2) / ry);
          var startAng = Math.acos(u.dot(v) / u.length() / v.length());
          if (u.x * v.y - u.y * v.x < 0)
            startAng = -startAng;

          // we can reuse 'v' from start angle as our 'u' for delta angle
          u.x = (-x1 - x2) / rx;
          u.y = (-y1 - y2) / ry;

          var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
          // This normalization ends up making our curves fail to triangulate...
          if (v.x * u.y - v.y * u.x < 0)
            deltaAng = -deltaAng;
          if (!sf && deltaAng > 0)
            deltaAng -= Math.PI * 2;
          if (sf && deltaAng < 0)
            deltaAng += Math.PI * 2;

          path.absarc(cx, cy, rx, startAng, startAng + deltaAng, sf);
          x = nx;
          y = ny;
          break;
        default:
          throw new Error("weird path command: " + activeCmd);
      }
      if (firstX === null) {
        firstX = x;
        firstY = y;
      }
      // just reissue the command
      if (canRepeat && nextIsNum())
        continue;
      activeCmd = pathStr[idx++];
    }

    return path;
  }
});