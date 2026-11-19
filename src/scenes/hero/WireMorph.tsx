import { useEffect, useMemo, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { buildMorphGeometry } from './morphShapes'
import { createMorphMaterial, createMorphUniforms } from './morphShader'

type Props = { progress: RefObject<number>; lite: boolean }

/** Rock → granules → oil drop. One shared buffer drawn twice: as line segments and as glowing points. */
export default function WireMorph({ progress, lite }: Props) {
  const geometry = useMemo(() => buildMorphGeometry(lite ? { plates: 6, ringPts: 14 } : { plates: 8, ringPts: 24 }), [lite])
  const uniforms = useMemo(createMorphUniforms, [])
  const [lineMat, pointMat] = useMemo(() => [createMorphMaterial(uniforms, false), createMorphMaterial(uniforms, true)], [uniforms])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(
    () => () => {
      lineMat.dispose()
      pointMat.dispose()
    },
    [lineMat, pointMat],
  )

  useFrame((state) => {
    uniforms.uProgress.value = progress.current ?? 0
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()
    const dist = state.camera.position.length()
    uniforms.uFogNear.value = dist - 0.8
    uniforms.uFogFar.value = dist + 3.2
  })

  return (
    <>
      <lineSegments geometry={geometry} material={lineMat} frustumCulled={false} />
      <points geometry={geometry} material={pointMat} frustumCulled={false} />
    </>
  )
}
