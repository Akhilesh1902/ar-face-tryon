import React, { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { updateFaceStore } from "./faceStore";
import Scene from "./ThreeJs";

const FaceMesh: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef =
    useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);

  /* -------------------- Camera -------------------- */
  const setupCamera = async () => {
    const video = videoRef.current!;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false,
    });

    video.srcObject = stream;

    return new Promise<void>((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });
  };

  /* -------------------- Model -------------------- */
  const loadModel = async () => {
    await tf.setBackend("webgl");
    await tf.ready();

    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;

    const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig =
      {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
        refineLandmarks: true,
      };

    detectorRef.current = await faceLandmarksDetection.createDetector(
      model,
      detectorConfig
    );
  };

  /* -------------------- Draw -------------------- */
  const drawFace = (
    faces: faceLandmarksDetection.Face[],
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    faces.forEach((face) => {
      face.keypoints.forEach((keypoint) => {
        // console.log({ keypoint });
        // console.log(keypoint.z);
        // if (keypoint.z && keypoint.z > 10) return;
        const { x, y } = keypoint;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = "#00FF00";
        ctx.fill();
      });
    });
  };

  /* -------------------- Detect Loop -------------------- */
  let lastTime = 0;
  const detect = async (time = 0) => {
    if (time - lastTime < 16) {
      requestAnimationFrame(detect);
      return;
    }

    lastTime = time;
    if (
      !detectorRef.current ||
      !videoRef.current ||
      videoRef.current.readyState < 2
    ) {
      requestAnimationFrame(detect);
      return;
    }

    const faces = await detectorRef.current.estimateFaces(videoRef.current);

    // 🔥 UPDATE FACE STORE HERE
    if (faces.length > 0) {
      updateFaceStore(
        faces[0],
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );
    }

    // Optional: hide goggles if no face
    if (faces.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateFaceStore(null as any, 0, 0);
    }

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawFace(faces, ctx);

    requestAnimationFrame(detect);
  };

  /* -------------------- Lifecycle -------------------- */
  useEffect(() => {
    const init = async () => {
      await setupCamera();
      await loadModel();
      detect();
    };

    init();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="camera_wrapper">
      <div style={{ position: "relative", width: 640, height: 480 }}>
        <video
          ref={videoRef}
          width={640}
          height={480}
          style={{ position: "absolute", left: 0, top: 0 }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ position: "absolute", left: 0, top: 0 }}
        />
        <div style={{ width: 640, height: 480 }}>
          <Scene />
        </div>
      </div>
    </div>
  );
};

export default FaceMesh;
