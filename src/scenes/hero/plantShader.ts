import * as THREE from 'three'
import { BELT_A, BELT_B } from './plantModel'
import { PLANT_SCALE } from './plantShapes'

// Assembly timeline (uProgress 0 → 1, shared with the slide swap):
//   0.00        crystals drift and tumble on their own
//   0.08–0.94   crystal k streams in over a 0.3 window starting at 0.08 + 0.5·k/(n-1) (dots trail a little)
//   1.00        plant formed; material dots ride the conveyor

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uSky;
  uniform vec3 uOrange;
  uniform vec3 uBelt;
  attribute vec4 aCrystal;
  attribute vec3 aTarget;
  attribute vec4 aMeta;
  varying vec3 vColor;
  varying float vAlpha;

  vec3 rotateAxis(vec3 v, vec3 k, float a) {
    return v * cos(a) + cross(k, v) * sin(a) + k * dot(k, v) * (1.0 - cos(a));
  }

  void main() {
    float ph = aCrystal.w;
    float rnd = aMeta.w;
    float flow = step(1.5, aMeta.z);

    // Stage A: each crystal tumbles about its own axis and drifts around its centre.
    vec3 axis = normalize(vec3(sin(ph * 13.0), cos(ph * 7.0) + 0.4, sin(ph * 3.0 + 1.0)));
    float ang = ph * 6.2832 + uTime * (0.22 + 0.25 * fract(ph * 5.0));
    vec3 drift = vec3(sin(uTime * 0.31 + ph * 20.0), cos(uTime * 0.27 + ph * 11.0), sin(uTime * 0.23 + ph * 5.0)) * 0.09;
    vec3 start = aCrystal.xyz + drift + rotateAxis(position, axis, ang);

    // Stage B: plant dot; conveyor dots loop up the belt.
    vec3 target = aTarget + uBelt * fract(rnd + uTime * 0.12) * flow;

    // Staggered per crystal; each dot trails a touch so the crystal streams in rather than teleports.
    float d = 0.08 + aMeta.x * 0.5 + fract(rnd * 7.0) * 0.05;
    float e = smoothstep(d, d + 0.3, uProgress);
    float arc = sin(e * 3.14159);
    vec3 p = mix(start, target, e);
    p.y += arc * (0.25 + 0.2 * ph);
    p += arc * 0.12 * vec3(sin(rnd * 40.0), cos(rnd * 23.0), sin(rnd * 57.0));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float orange = mix(aMeta.y, min(aMeta.z, 1.0), e);
    vColor = mix(uSky, uOrange, orange);
    float fog = 1.0 - 0.7 * smoothstep(uFogNear, uFogFar, -mv.z);
    gl_PointSize = uSize * uPixelRatio * (1.0 + 0.6 * arc + 0.3 * orange) * (6.0 / -mv.z);
    vAlpha = (0.85 + 0.15 * arc) * fog;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft round sprite.
    float a = vAlpha * smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5));
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
    uFogNear: { value: 6 },
    uFogFar: { value: 10 },
    // Pushed a little above 1 so the dots feed the bloom pass.
    uSky: { value: new THREE.Color('#8CC3E8').multiplyScalar(1.15) },
    uOrange: { value: new THREE.Color('#F2A25C').multiplyScalar(1.25) },
    uBelt: { value: new THREE.Vector3(...BELT_B).sub(new THREE.Vector3(...BELT_A)).multiplyScalar(PLANT_SCALE) },
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
