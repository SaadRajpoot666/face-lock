import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { FACEMESH_LEFT_EYE, FACEMESH_RIGHT_EYE } from "@mediapipe/face_mesh";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/UserContext";

export const SignUp = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: 480,
        height: 480,
      });
      camera.start();
    }
  }, []);

  const drawLandmarks = (ctx, landmarks, connections, color) => {
  for (let [startIdx, endIdx] of connections) {
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];
    if (start && end) {
      ctx.beginPath();
      ctx.moveTo(start.x * 480, start.y * 480);
      ctx.lineTo(end.x * 480, end.y * 480);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
};

const onResults = (results) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.clearRect(0, 0, 480, 480);
  ctx.drawImage(results.image, 0, 0, 480, 480);

  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      drawLandmarks(ctx, landmarks, FACEMESH_LEFT_EYE, "#00ff00");
      drawLandmarks(ctx, landmarks, FACEMESH_RIGHT_EYE, "#00ff00");
      drawLandmarks(ctx, landmarks, [[6,197],[197,195],[195,5],[5,4]], "#00bfff"); // nose bridge
    }
  }

  ctx.restore();
};


  const captureAndUpload = async () => {
    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    setIsProcessing(true);

    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      const file = new File([blob], `${name}_face.jpg`, { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("name", name);
      formData.append("face_image", file);

      try {
        const res = await axios.post("http://127.0.0.1:8000/signup", formData);
        setMessage(res.data.message);
        login({ name });
        navigate("/login");
      } catch (err) {
        console.error(err);
        setMessage("Signup failed. No face found.");
      } finally {
        setIsProcessing(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h2 className="text-2xl text-blue-400 mb-4 font-bold">Live AI Face Signup</h2>

      <div className="relative w-[480px] h-[480px]">
        <video ref={webcamRef} className="absolute top-0 left-0 w-full h-full rounded-xl" playsInline></video>
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full rounded-xl"></canvas>
      </div>

      <input
        type="text"
        placeholder="Enter your name"
        className="mt-4 px-4 py-2 placeholder:text-white bg-gray-900 border-2 border-blue-600 text-white  rounded-lg w-full max-w-xs outline-none"
        value={name}
        
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={captureAndUpload}
        className="mt-4 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600"
        disabled={isProcessing}
      >
        {isProcessing ? "Uploading..." : "Capture & Sign Up"}
      </button>

      {message && <p className="mt-4 text-blue-300">{message}</p>}
    </div>
  );
};
