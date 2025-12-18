import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { faceStore } from "./faceStore";
import { DracoModel } from "./DracoModel";
export function Goggles() {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;

    ref.current.visible = faceStore.transform.visible;

    if (!faceStore.transform.visible) return;

    const { position, rotation, scale } = faceStore.transform;
    // console.log(faceStore.transform);

    ref.current.position.lerp(position, 0.25);
    ref.current.rotation.copy(rotation);

    const s = THREE.MathUtils.lerp(ref.current.scale.x, scale * 0.4, 0.25);
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref}>
      <DracoModel url="goggles.glb" />
    </group>
  );
}
