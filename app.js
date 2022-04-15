import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import fragmentShader from "./fragment.glsl";
// import fragmentShader from "./fragmentRayMarchStarter.glsl";
import vertexShader from "./vertex.glsl";
import Leaf from "./Leaf";
import Branch from "./Branch";
import Tree from "./Tree";

class World {
  constructor() {
    this.time = 0;
    this.prepareCanvas();
    window.addEventListener("resize", this.resize.bind(this));
    this.setTree();
    this.resize();
    this.render();
  }

  prepareCanvas() {
    this.container = document.querySelector("#canvas");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      2000
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // this.renderer.setClearColor(0x000000);
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.z = 240;
    // this.debug = new Pane();
    this.textureLoader = new THREE.TextureLoader();
  }

  setTree() {
    this.tree = new Tree({
      leafCount: 500,
      rootPosition: new THREE.Vector3(0, -650, 0),
      maxDistance: 100,
      minDistance: 1,
      scene: this.scene,
    });
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    /** fullscreen */
    // this.camera.fov =
    //   (360 / Math.PI) * Math.atan(this.height / (2 * this.camera.position.z));
    // this.mesh.scale.set(this.width, this.height, 1);

    this.camera.updateProjectionMatrix();
  }

  update() {
    this.tree.grow();
  }

  render() {
    this.time += 0.01633;
    this.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new World();
