define(["threejs"], function(THREE) {
  return function(canvas) {
    var SCALE = 1;

    var scene = new THREE.Scene();

    var camera = new THREE.OrthographicCamera(0, 1, 1, 0);
    camera.position.z = 100;
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

    this.backgroundImage = null;
    this.screenshotImage = null;
    this.transform = null;

    this.render = function() {
      if (background.material.map.image != this.backgroundImage) {
        background.material.map.image = this.backgroundImage;
        background.material.map.needsUpdate = true;

        background.scale.x = this.backgroundImage.width;
        background.scale.y = this.backgroundImage.height;

        camera.top = this.backgroundImage.height;
        camera.right = this.backgroundImage.width;
        camera.updateProjectionMatrix();

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
});