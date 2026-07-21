import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import ErrorBoundary from "./ErrorBoundary";

export default function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let started = false;
    let cancelled = false; // guards against StrictMode double-invoke / late callbacks after unmount

    const stopCamera = () => {
      try {
        Quagga.offDetected();
        Quagga.stop();
      } catch (e) {
        // ignore
      }
      const video = scannerRef.current?.querySelector("video");
      const stream = video?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    };

    const initQuagga = (retries = 3) => {
      if (!scannerRef.current || cancelled) return;

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              facingMode: { ideal: "environment" },
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
          },
          decoder: { readers: ["ean_reader", "code_128_reader"] },
          locate: true,
        },
        (err) => {
          if (cancelled) return; // component unmounted while init was in flight

          if (err) {
            if (err.name === "NotReadableError" && retries > 0) {
              setError("Camera busy, retrying..." + retries);
              setTimeout(() => initQuagga(retries - 1), 1000);
              return;
            }
            if (err.name === "NotAllowedError") {
              setError("Camera access denied. Please enable permissions.");
              return;
            }
            if (err.name === "NotFoundError") {
              setError("No camera found on this device.");
              return;
            }
            const parts = [err?.name, err?.message].filter(Boolean);
            setError(parts.length ? parts.join(": ") : "Error initializing camera");
            console.error("Quagga init error:", err);
            return;
          }

          Quagga.start();
          started = true;

          Quagga.onDetected((data) => {
            setError(data?.codeResult?.code ? "Barcode detected: " + data.codeResult.code : "No barcode detected");
            const code = data?.codeResult?.code;
            if (code && code.length === 13) {
              onDetected?.(code);
              stopCamera();
              started = false;
            }
          });
        }
      );
    };

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera not supported in this browser");
      return;
    }

    initQuagga();

  return () => {
    cancelled = true;
    stopCamera(); // unconditional — don't gate this behind `started`
  };
  }, []);

  return (
    <div>
      <ErrorBoundary>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}
        <div
          ref={scannerRef}
          style={{ width: "100%", height: "400px" }}
        ></div>
      </ErrorBoundary>
    </div>
  );
}