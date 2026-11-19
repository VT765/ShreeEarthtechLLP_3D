import * as THREE from 'three'
import { BELT_A, BELT_B } from './plantModel'

// Assembly timeline (uProgress 0 → 1, shared with the slide swap; 1 = pin end, About fully shown):
//   0.00        tiny crystals fill the hero, revolving slowly round the screen centre
//   0.03–1.00   dot k leaves the field over a 0.28 window starting at 0.03 + 0.62·k/n (+ jitter),
//               so the plant keeps building for as long as the visitor scrolls
//   1.00        plant formed; material dots ride the conveyor; free dust keeps drifting behind it

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uAspect;
  uniform float uFieldR;
  uniform float uCamDist;
  uniform vec3 uSky;
  uniform vec3 uOrange;
  uniform vec3 uBelt;
  attribute vec4 aField;
  attribute vec4 aOrbit;
  attribute vec4 aMeta;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vShape;
  varying float vSpin;

  void main() {
    float ph = aField.w;
    float kind = aMeta.y;
    float rnd = aMeta.z;
    float dust = step(2.5, kind);
    float flow = step(1.5, kind) * (1.0 - dust);

    // Stage A, in screen units (y -1..1): anchors swirl round the centre (nearer layers faster) and each
    // dot circles its own anchor. Unprojected at its depth, so the field fills the canvas whatever the
    // camera, view offset or aspect.
    float swirl = uTime * (0.05 - 0.03 * aField.z);
    vec2 a = mat2(cos(swirl), sin(swirl), -sin(swirl), cos(swirl)) * aField.xy * uFieldR;
    float th = ph * 6.2832 + uTime * aOrbit.y;
    a += vec2(cos(th), sin(th)) * aOrbit.x;
    float depth = mix(4.5, 11.0, aField.z) + sin(uTime * 0.3 + ph * 17.0) * 0.4;
    vec2 ndc = vec2(a.x / uAspect, a.y);
    vec3 start = vec3(
      depth * (ndc.x + projectionMatrix[2][0]) / projectionMatrix[0][0],
      depth * (ndc.y + projectionMatrix[2][1]) / projectionMatrix[1][1],
      -depth);

    // Stage B: plant dot in view space; conveyor dots loop up the belt.
    vec3 target = (modelViewMatrix * vec4(position + uBelt * fract(rnd + uTime * 0.12) * flow, 1.0)).xyz;

    // Build order with a little jitter, so parts stream in rather than pop.
    float d = 0.03 + aMeta.x * 0.62 + fract(rnd * 7.0) * 0.06;
    float e = smoothstep(d, d + 0.28, uProgress) * (1.0 - dust);
    float arc = sin(e * 3.14159);
    vec3 p = mix(start, target, e);
    p.y += arc * (0.3 + 0.3 * ph);
    p += arc * 0.15 * vec3(sin(rnd * 40.0), cos(rnd * 23.0), sin(rnd * 57.0));
    gl_Position = projectionMatrix * vec4(p, 1.0);

    float orange = mix(aOrbit.w, min(kind, 1.0), e);
    vColor = mix(uSky, uOrange, orange);

    // Field dots shrink and dim with depth; plant dots keep a steady size whatever the camera distance.
    float sizeA = (mix(0.65, 1.05, rnd) + aOrbit.z * 3.0) * 6.0 / depth;
    float sizeB = (1.0 + 0.3 * orange) * uCamDist / max(-target.z, 0.1);
    gl_PointSize = uSize * uPixelRatio * mix(sizeA, sizeB, e) * (1.0 + 0.6 * arc);

    float twinkle = 0.7 + 0.3 * sin(uTime * (0.8 + 2.0 * fract(ph * 13.0)) + ph * 40.0);
    float alphaA = 0.7 * twinkle * (1.0 - 0.55 * aField.z) * (1.0 - 0.4 * dust * uProgress);
    float alphaB = 0.9 * (1.0 - 0.5 * smoothstep(uCamDist - 1.2, uCamDist + 1.5, -target.z));
    vAlpha = mix(alphaA, alphaB, e) + 0.15 * arc;
    vShape = aOrbit.z * (1.0 - e);
    vSpin = ph * 6.2832 + uTime * aOrbit.y;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vShape;
  varying float vSpin;

  void main() {
    vec2 q = gl_PointCoord - 0.5;
    // Soft round dot, or (for the crystal sprites) a spinning hexagonal platelet outline.
    float dotA = smoothstep(0.5, 0.1, length(q));
    q = abs(mat2(cos(vSpin), sin(vSpin), -sin(vSpin), cos(vSpin)) * q);
    float hex = max(dot(q, vec2(0.866025, 0.5)), q.y);
    float hexA = max(smoothstep(0.09, 0.0, abs(hex - 0.34)), 0.25 * step(hex, 0.34));
    float a = vAlpha * mix(dotA, hexA, vShape);
    if (a < 0.003) discard;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`

export type PlantUniforms = ReturnType<typeof createPlantUniforms>

export function createPlantUniforms(size: number) {
  return {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: size },
    uPixelRatio: { value: 1 },
    uAspect: { value: 1 },
    uFieldR: { value: 1.5 },
    uCamDist: { value: 7 },
    // Pushed a little above 1 so the dots feed the bloom pass.
    uSky: { value: new THREE.Color('#8CC3E8').multiplyScalar(1.15) },
    uOrange: { value: new THREE.Color('#F2A25C').multiplyScalar(1.25) },
    uBelt: { value: new THREE.Vector3(...BELT_B).sub(new THREE.Vector3(...BELT_A)) },
  }
}

/** Additive, depth-write-free soft-point material. */
export function createPlantMaterial(uniforms: PlantUniforms) {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}
