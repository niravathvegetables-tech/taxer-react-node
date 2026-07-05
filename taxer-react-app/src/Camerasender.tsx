import React, { useEffect, useRef, useState } from "react";

const SERVER_URL = "https://wordpress-kuyu3.wasmer.app/frame-server/";

export default function CameraSender() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Starting camera...");

  useEffect(() => {
    let stream: MediaStream | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    async function startCamera() {
      try {
        console.log("Requesting camera access...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        console.log("Camera stream obtained:", stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("Video element attached to stream");
        }

        setStatus("Streaming...");

        intervalId = setInterval(() => {
          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (!video || !canvas || !video.videoWidth) {
            console.warn("Video not ready yet");
            return;
          }

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            console.error("Canvas context not available");
            return;
          }

          ctx.drawImage(video, 0, 0);
          const frameData = canvas.toDataURL("image/jpeg", 1);
          console.log("Preparing to upload frame, length:", frameData.length);

          fetch(`${SERVER_URL}?upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ frame: frameData }),
          })
            .then(async (res) => {
              console.log("Upload response status:", res.status);
              const text = await res.text();
              console.log("Upload response body:", text);
              if (res.ok) {
                setStatus("Upload OK");
              } else {
                setStatus("Upload failed: " + text);
              }
            })
            .catch((err) => {
              console.error("Upload error:", err);
              setStatus("Upload failed: " + err.message);
            });
        }, 2000);
      } catch (err: any) {
        console.error("Camera error:", err);
        setStatus("Camera access denied: " + err.message);
      }
    }

    startCamera();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Stopped upload interval");
      }
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("Stopped camera track:", track.kind);
        });
      }
    };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Camera Sender</h2>
      <p>{status}</p>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", maxWidth: 400 }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}