import { useEffect, useMemo, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { buildMorphGeometry } from './morphShapes'
import { createMorphMaterial, createMorphUniforms } from './morphShader'

type Props = { progress: RefObject<number>; lite: boolean }

/** Bentonite crystal → granules → oil drop. One shared buffer drawn twice: as line segments and as glowing points. */
export default function WireMorph({ progress, lite }: Props) {
  const geometry = useMemo(() => buildMorphGeometry(
        lite
          ? { layers: 3, rings: 1, edge: 0.42, perSide: 1, cationsPerGap: 4, ringPts: 14 }
          : { layers: 4, rings: 2, edge: 0.3, perSide: 2, cationsPerGap: 6, ringPts: 24 },
      ), [lite])
  const uniforms = useMemo(() => createMorphUniforms(), [])
  const [lineMat, pointMat] = useMemo(() => [createMorphMaterial(uniforms, false), createMorphMaterial(uniforms, true)], [uniforms])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(
    () => () => {
      lineMat.dispose()
      pointMat.dispose()
    },
    [lineMat, pointMat],
  )

  // Per-frame uniform writes are R3F's intended pattern; they never feed React rendering.
  /* eslint-disable react-hooks/immutability */
  useFrame((state) => {
    uniforms.uProgress.value = progress.current ?? 0
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()
    const dist = state.camera.position.length()
    uniforms.uFogNear.value = dist - 0.8
    uniforms.uFogFar.value = dist + 3.2
  })
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <lineSegments geometry={geometry} material={lineMat} frustumCulled={false} />
      <points geometry={geometry} material={pointMat} frustumCulled={false} />
    </>
  )
}
