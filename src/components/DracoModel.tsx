import { useEffect, type JSX } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type DracoModelProps = JSX.IntrinsicElements["group"] & {
  url: string;
};

export function DracoModel({ url, ...props }: DracoModelProps) {
  const { scene } = useGLTF(url, true); // `true` enables DRACO

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      {...props}
    />
  );
}

// Optional preload
useGLTF.preload("googles2.glb");
