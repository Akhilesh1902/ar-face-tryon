import * as THREE from "three";
import type { Face } from "@tensorflow-models/face-landmarks-detection";

/**
 * Shared face transform reference
 * Updated by Face Detection loop
 * Read by React Three Fiber useFrame
 */
export const faceStore = {
  transform: {
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: 1,
    visible: false,
  },
};

/**
 * Update face transform from MediaPipe FaceMesh result
 */
export function updateFaceStore(
  face: Face,
  videoWidth: number,
  videoHeight: number
) {
  if (!face || face.keypoints.length === 0) {
    faceStore.transform.visible = false;
    return;
  }

  const leftEye = face.keypoints[33];
  const rightEye = face.keypoints[263];
  const nose = face.keypoints[1];
  // console.log({ leftEye });
  // ---------- Position (Normalized -1 to 1) ----------
  const centerX = (leftEye.x + rightEye.x) / 2;
  const centerY = (leftEye.y + rightEye.y) / 2;

  const x = (centerX / videoWidth - 0.5) * 2;
  const y = -(centerY / videoHeight - 0.5) * 2;

  faceStore.transform.position.set(x, y, 0);

  // ---------- Scale (Eye Distance) ----------
  const eyeDistance = Math.hypot(
    leftEye.x - rightEye.x,
    leftEye.y - rightEye.y
  );

  faceStore.transform.scale = eyeDistance / videoWidth;

  // ---------- Rotation (Roll from eyes slope) ----------

  // Roll (tilt)
  //   const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  // const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  const roll = -Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  // Face center
  const eyeCenterX = (leftEye.x + rightEye.x) / 2;
  // const eyeCenterY = (leftEye.y + rightEye.y) / 2;

  // Yaw (look left/right)
  const yaw = ((nose.x - eyeCenterX) / videoWidth) * Math.PI;

  // Pitch (look up/down)
  // const pitch = ((nose.y - eyeCenterY) / videoHeight) * Math.PI;

  const forehead = face.keypoints[10];
  const chin = face.keypoints[152];

  /**
   * MediaPipe z:
   * - negative = closer to camera
   * - positive = farther
   */
  const depthDiff = chin.z! - forehead.z!;

  // Normalize by face size (eye distance gives scale invariance)
  const pitch = THREE.MathUtils.clamp(depthDiff / eyeDistance, -0.6, 0.6) * 0.5;

  // IMPORTANT: order is X (pitch), Y (yaw), Z (roll)
  faceStore.transform.rotation.set(pitch, yaw * 2, roll);

  faceStore.transform.visible = true;
}
