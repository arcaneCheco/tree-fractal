import Line from "./Line";
import * as THREE from "three";

export default class LinesGeometry extends THREE.BufferGeometry {
  pointsPerFrame: number;
  pointsPerLine: number;
  useLengthSampling: boolean;
  constructor(
    lines: Line[],
    pointsPerFrame: number,
    pointsPerLine: number,
    useLengthSampling: boolean
  ) {
    super();
    this.pointsPerFrame = pointsPerFrame;
    this.pointsPerLine = pointsPerLine;
    this.useLengthSampling = useLengthSampling;
    this.setAttributes(lines);
  }
  setAttributes(lines: Line[]) {
    const position1 = [];
    const position2 = [];
    const seed = [];

    let accumulatedLinesLength = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      accumulatedLinesLength += line.v1.distanceTo(line.v2) * line.weight;
    }

    let pointsPerUnit = this.pointsPerFrame / accumulatedLinesLength;

    for (let j = 0; j < lines.length; j++) {
      let line = lines[j];

      const l1 = line.v1;
      const l2 = line.v2;
      let weight = line.weight;

      let points = this.pointsPerLine;
      let invPointsPerLine = 1 / points;

      if (this.useLengthSampling) {
        let lineLength = line.v1.distanceTo(line.v2);

        points = Math.max(Math.floor(pointsPerUnit * lineLength * weight), 1);
        invPointsPerLine = 1 / points;
      }

      for (let ppr = 0; ppr < points; ppr++) {
        position1.push(l1.x, l1.y, l1.z);
        position2.push(l2.x, l2.y, l2.z);

        seed.push(
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        );
      }
    }

    this.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(position1), 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );
    this.setAttribute(
      "position1",
      new THREE.BufferAttribute(new Float32Array(position2), 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );
    this.setAttribute(
      "aSeed",
      new THREE.BufferAttribute(new Float32Array(seed), 4)
    );
  }
}
