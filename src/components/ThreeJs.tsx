import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  OrthographicCamera,
} from "@react-three/drei";
import { Goggles } from "./Goggles";

export default function Scene() {
  return (
    <Canvas
      // camera={{ position: [0, 1.5, 3], fov: 45 }}
      camera={{ zoom: 200, position: [0, 0, 5] }}
      gl={{ antialias: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
      />
      <OrthographicCamera
        makeDefault
        position={[0, 0, 5]}
        zoom={200}
      />
      <Suspense fallback={null}>
        {/* <DracoModel
          url="goggles2.glb"
          scale={1}
          position={[0, 0, 0]}
        /> */}
        <Goggles />
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls enableDamping />
    </Canvas>
  );
}
