import { type JSX } from "react";
import { useGLTF } from "@react-three/drei";
// import { GroupProps } from "@react-three/fiber";

type ModelProps = JSX.IntrinsicElements["group"] & {
  url: string;
};

export function Model({ url, ...props }: ModelProps) {
  const { scene } = useGLTF(url);

  return (
    <primitive
      object={scene}
      {...props}
    />
  );
}

// Optional: preload model
useGLTF.preload("googles.glb");
