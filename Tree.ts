import * as THREE from "three";
import Leaf from "./Leaf";
import Branch from "./Branch";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export default class Tree {
  leafCount: number;
  rootPosition: THREE.Vector3;
  maxDistance: number;
  minDistance: number;
  scene: THREE.Scene;
  leafs: Leaf[];
  leafPositions: Float32Array;
  leafColors: Float32Array;
  leafsGeometry: THREE.BufferGeometry;
  leafsMaterial: THREE.PointsMaterial;
  leafsMesh: THREE.Points;
  branches: Branch[];
  rootBranch: Branch;
  branchesGeometry: THREE.BufferGeometry;
  branchPositions: Float32Array;
  branchMaterial: THREE.LineBasicMaterial;
  branchesMesh: THREE.LineSegments;
  constructor({ leafCount, rootPosition, maxDistance, minDistance, scene }) {
    this.leafCount = leafCount;
    this.rootPosition = rootPosition;
    this.maxDistance = maxDistance;
    this.minDistance = minDistance;
    this.scene = scene;
    this.init();
  }

  async init() {
    this.setLeafs();
    // await this.setWolfLeafs();
    this.setRootBranch();
    this.growRootBranch();
  }

  setWolfLeafs() {
    return new Promise<void>((resolve) => {
      let loader2 = new OBJLoader();
      loader2.load("wolf.obj", (model) => {
        const g = model.children[0].geometry.attributes.position.array.map(
          (num: number) => num * 30
        );
        console.log(g.length);
        this.leafs = [];
        for (let i = 0; i < g.length / 3 - 12; i = i + 2) {
          this.leafs.push(
            new Leaf(new THREE.Vector3(g[i * 3], g[i * 3 + 1], g[i * 3 + 2]))
          );
        }

        const d = new THREE.Points(
          model.children[0].geometry,
          new THREE.MeshBasicMaterial()
        );
        d.scale.multiplyScalar(30);
        this.scene.add(d);
        resolve();
      });
      const l = new THREE.AmbientLight();
      this.scene.add(l);
    });
  }

  setLeafs() {
    this.leafs = [];
    this.leafPositions = new Float32Array(this.leafCount * 3);
    this.leafColors = new Float32Array(this.leafCount * 3);
    for (let i = 0; i < this.leafCount; i++) {
      // sperical
      //
      const theta = Math.random() * 2.0 * Math.PI;
      const phi = Math.random() * Math.PI;
      // const r = Math.random() * 80;
      const r = 80;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      //
      //   const x = (Math.random() - 0.5) * 100;
      //   const y = (Math.random() - 0.5) * 100;
      //   const z = (Math.random() - 0.5) * 100;
      //
      this.leafPositions[i * 3] = x;
      this.leafPositions[i * 3 + 1] = y;
      this.leafPositions[i * 3 + 2] = z;
      this.leafColors[i * 3] = 1;
      this.leafColors[i * 3 + 1] = 1;
      this.leafColors[i * 3 + 2] = 1;
      this.leafs.push(new Leaf(new THREE.Vector3(x, y, z)));
    }
    this.leafsGeometry = new THREE.BufferGeometry();
    this.leafsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.leafPositions, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );
    this.leafsGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.leafColors, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );
    this.leafsMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
    });
    this.leafsMesh = new THREE.Points(this.leafsGeometry, this.leafsMaterial);

    this.scene.add(this.leafsMesh);
  }

  setRootBranch() {
    this.branches = [];
    this.rootBranch = new Branch({
      pos: this.rootPosition,
      parent: null,
      dir: new THREE.Vector3(0, 1, 0),
    });
    this.branches.push(this.rootBranch);
  }

  growRootBranch() {
    let currentBranch = this.rootBranch;
    let found = false;
    while (!found) {
      for (let i = 0; i < this.leafCount; i++) {
        const dist = currentBranch.rootPos.distanceTo(this.leafs[i].pos);
        if (dist < this.minDistance) {
          found = true;
        }
      }
      if (!found) {
        currentBranch = currentBranch.next();
        this.branches.push(currentBranch);
      }
    }
  }

  grow() {
    for (let i = 0; i < this.leafs.length; i++) {
      const leaf = this.leafs[i];
      if (leaf.reached) {
      } else {
        let closestBranch = null;
        let record = this.maxDistance;

        // find closest branch to leave
        for (let j = 0; j < this.branches.length; j++) {
          const branch = this.branches[j];
          const dist = branch.rootPos.distanceTo(leaf.pos);
          if (dist < this.minDistance) {
            // reached a leaf
            leaf.reached = true;
            closestBranch = null;
            break;
          } else if (dist < record) {
            closestBranch = branch;
            record = dist;
          }
        }

        // if a branch has been found, adjust direction of branch
        if (closestBranch !== null) {
          const newDir = leaf.pos.clone().sub(closestBranch.rootPos);
          newDir.normalize();
          closestBranch.dir.add(newDir);
          closestBranch.count++;
        }
      }
    }

    // // remove leafs that have been reached
    // for (let i = 0; i < this.leafs.length; i++) {
    //   if (this.leafs[i].reached) {
    //     // this.leafs.splice(i, 1);
    //     this.leafColors[i * 3] = 0;
    //     this.leafColors[i * 3 + 1] = 0;
    //     this.leafColors[i * 3 + 2] = 0;
    //     this.leafPositions[i * 3] = 1000000;
    //     this.leafColors[i * 3 + 1] = 1000000;
    //     this.leafColors[i * 3 + 2] = 1000000;
    //   }
    // }

    // grow branches that have leafs nearby
    for (let i = 0; i < this.branches.length; i++) {
      const branch = this.branches[i];
      if (branch.count > 0) {
        branch.dir.divideScalar(branch.count + 1);
        const newBranch = branch.next();
        this.branches.push(newBranch);
      }
      branch.reset();
    }
  }
}
