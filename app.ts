import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import Tree from "./Tree";
import Line from "./Line";
import LinesGeometry from "./LinesGeometry";
import lineVertex from "./shaders/line/vertex.glsl";
import lineFragment from "./shaders/line/fragment.glsl";

class World {
  time: number;
  container: HTMLDivElement;
  width: number;
  height: number;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  tree: Tree;
  controls: OrbitControls;
  textureLoader: THREE.TextureLoader;
  lines: Line[];
  linesMaterial: THREE.ShaderMaterial;
  mesh: THREE.Points<LinesGeometry, THREE.Material | THREE.Material[]>;
  constructor() {
    this.time = 0;
    this.prepareCanvas();
    window.addEventListener("resize", this.resize.bind(this));

    this.init();
  }

  async init() {
    await this.setTree();
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

  async setTree() {
    this.tree = new Tree({
      leafCount: 500,
      rootPosition: new THREE.Vector3(0, 10, 0),
      maxDistance: 25,
      minDistance: 9,
      scene: this.scene,
    });

    await new Promise<void>((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 1000);
    });

    for (let i = 0; i < 300; i++) {
      this.tree.grow();
    }

    this.lines = [];
    this.tree.branches.map((branch) => {
      if (branch.parentPos) {
        this.lines.push(
          new Line({
            v1: branch.rootPos,
            v2: branch.parentPos.rootPos,
          })
        );
      }
    });

    const linesGeometry = new LinesGeometry(
      this.lines,
      500, //this.settings.pointsPerFrame,
      25, // this.settings.pointsPerLine,
      false //this.settings.useLengthSampling
    );
    this.linesMaterial = new THREE.ShaderMaterial({
      vertexShader: lineVertex,
      fragmentShader: lineFragment,
      uniforms: {
        uTime: { value: 0 },
        uRandom: { value: Math.random() * 1000 },
        uRandomVec4: {
          value: new THREE.Vector4(
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ),
        },
        uFocalDepth: { value: 100 }, // this.settings.cameraFocalDistance
        uBokehStrength: { value: 0.02 }, // value: this.settings.bokehStrength
        uMinimumLineSize: { value: 0.005 }, // this.settings.minimumLineSize
        uFocalPowerFunction: { value: 0 }, // this.settings.focalPowerFunction
        uBokehTexture: {
          value: new THREE.TextureLoader().load("assets/bokeh/c1.png"),
        },
        uDistanceAttenuation: { value: 0.002 }, // this.settings.distanceAttenuation
      },

      defines: {
        USE_BOKEH_TEXTURE: 0,
      },

      side: THREE.DoubleSide,
      depthTest: false,

      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendDstAlpha: THREE.OneFactor,
    });
    this.mesh = new THREE.Points(linesGeometry, this.linesMaterial);
    this.scene.add(this.mesh);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.linesMaterial.uniforms.uTime.value = (this.time * 0.001) % 100;
  }

  render() {
    this.time += 0.01633;
    this.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new World();
