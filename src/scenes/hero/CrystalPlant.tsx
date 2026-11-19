import { useEffect, useMemo, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { buildPlantGeometry, PLANT_DETAIL } from './plantShapes'
import { createPlantMaterial, createPlantUniforms } from './plantShader'

type Props = { progress: RefObject<number>; lite: boolean }

/** Tiny crystals fill the hero and revolve, then stream together into the plant. One buffer, one draw call. */
export default function CrystalPlant({ progress, lite }: Props) {
  const geometry = useMemo(() => buildPlantGeometry(lite ? PLANT_DETAIL.mobile : PLANT_DETAIL.desktop), [lite])
  // Sparser dots on phones are drawn a bit larger so the outlines still read.
  const uniforms = useMemo(() => createPlantUniforms(lite ? 3.2 : 2.4), [lite])
  const material = useMemo(() => createPlantMaterial(uniforms), [uniforms])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  // Per-frame uniform writes are R3F's intended pattern; they never feed React rendering.
  /* eslint-disable react-hooks/immutability */
  useFrame((state) => {
    const aspect = state.size.width / state.size.height
    uniforms.uProgress.value = progress.current ?? 0
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()
    uniforms.uAspect.value = aspect
    // Disc radius that reaches the canvas corners, plus the widest orbit.
    uniforms.uFieldR.value = Math.hypot(aspect, 1) + 0.08
    uniforms.uCamDist.value = state.camera.position.length()
  })
  /* eslint-enable react-hooks/immutability */

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
