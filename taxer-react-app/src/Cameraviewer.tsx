import React, { useEffect, useState } from "react";

const SERVER_URL = "https://wordpress-kuyu3.wasmer.app/frame-server/";

export default function CameraViewer() {
  const [src, setSrc] = useState(`${SERVER_URL}?frame=1&t=${Date.now()}`);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSrc(`${SERVER_URL}?frame=1&t=${Date.now()}`);
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Live View</h2>
      <img
        src={src}
        alt="Live camera feed"
        style={{ maxWidth: "100%" }}
        onError={(e) => {
          (e.target as HTMLImageElement).alt = "Waiting for first frame...";
        }}
      />
    </div>
  );
}