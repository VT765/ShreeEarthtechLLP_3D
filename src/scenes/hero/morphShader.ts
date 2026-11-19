import * as THREE from 'three'

// Morph timeline (uProgress 0 → 1, shared with the slide swap):
//   0.00–0.30  interlayer gaps open      0.04–0.30  cations escape first
//   0.10–0.54  lattice breaks into granules (staggered)
//   0.50–0.96  granules regroup as drop  0.55–1.00  colour shifts teal → gold

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uTeal;
  uniform vec3 uGold;
  attribute vec3 aTarget;
  attribute vec3 aScatter;
  attribute vec4 aMeta;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float t = uProgress;
    float rnd = aMeta.x;
    float cation = step(1.5, aMeta.z);
    float accent = min(aMeta.z, 1.0);

    // Acid activation: the interlayer gaps swell, cations leave first, then the lattice breaks up.
    vec3 rockPos = position + vec3(0.0, aMeta.y * 0.3 * smoothstep(0.0, 0.3, t), 0.0);
    float e1 = mix(
      smoothstep(0.1 + rnd * 0.2, 0.36 + rnd * 0.18, t),
      smoothstep(0.04 + rnd * 0.08, 0.2 + rnd * 0.1, t),
      cation
    );
    float e2 = smoothstep(0.5 + rnd * 0.16, 0.74 + rnd * 0.22, t);
    float loose = e1 * (1.0 - e2);
    vec3 drift = vec3(
      sin(uTime * 0.7 + rnd * 40.0),
      cos(uTime * 0.55 + aMeta.w * 30.0),
      sin(uTime * 0.45 + rnd * 17.0)
    ) * 0.14;
    vec3 p = mix(mix(rockPos, aScatter + drift, e1), aTarget, e2);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float gold = max(smoothstep(0.55, 1.0, t) * (0.55 + 0.45 * aMeta.w), accent);
    vColor = mix(uTeal, uGold, gold);
    float fog = 1.0 - 0.85 * smoothstep(uFogNear, uFogFar, -mv.z);

    #ifdef POINTS
      gl_PointSize = uSize * uPixelRatio * (0.6 + 2.2 * loose + 1.8 * cation) * (6.0 / -mv.z);
      vAlpha = (0.16 + 0.7 * loose + 0.6 * cation) * fog;
    #else
      vAlpha = (0.5 + 0.3 * accent) * fog;
    #endif
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float a = vAlpha;
    #ifdef POINTS
      a *= smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
    #endif
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`

export type MorphUniforms = ReturnType<typeof createMorphUniforms>

export function createMorphUniforms() {
  return {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: 2.2 },
    uPixelRatio: { value: 1 },
    uFogNear: { value: 6 },
    uFogFar: { value: 10 },
    // Pushed above 1 so the lines feed the bloom pass.
    uTeal: { value: new THREE.Color('#1E8C7E').multiplyScalar(1.8) },
    uGold: { value: new THREE.Color('#E0B04A').multiplyScalar(1.25) },
  }
}

/** Additive, depth-write-free material; `points` switches the same shader to soft round sprites. */
export function createMorphMaterial(uniforms: MorphUniforms, points: boolean) {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    defines: points ? { POINTS: '' } : {},
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}
