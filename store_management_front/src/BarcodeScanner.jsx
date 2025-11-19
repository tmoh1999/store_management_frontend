import React, { useEffect, useRef } from "react";
import Quagga from "quagga";
import ErrorBoundary from "./ErrorBoundary";
async function isCameraPermissionGranted() {
  if (!navigator.permissions) {
    console.warn("Permissions API not supported");
    return false;
  }

  try {
    const result = await navigator.permissions.query({ name: "camera" });
    return result.state === "granted"; // true if granted, false otherwise
  } catch (err) {
    console.error("Cannot check camera permission", err);
    return false;
  }
}


export default function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);


  	


    let isCameraActive = true;
   
    const startScanner = async () => {
    
       if (!scannerRef.current) return;
       
       
      try {
      	// Usage
isCameraPermissionGranted().then( async (granted) => {
  if (granted) {
    console.log("Camera permission: YES");
  } else {
    isCameraActive=false;
    console.log("Camera permission: NO");
    await navigator.mediaDevices.getUserMedia({ video: true });
  }
});
        
       
        if (!isCameraActive || !scannerRef.current) return;
        
        Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              target: scannerRef.current,
              constraints: { facingMode: "environment" },
            },
            decoder: { readers: ["ean_reader", "code_128_reader"] },
            locate: true,
          },
          (err) => {
            if (err) {
              console.error("Quagga init error:", err);
              return;
            }
            Quagga.start();
          }
        );

        Quagga.onDetected((data) => {
          const code = data?.codeResult?.code;
          if (code && code.length === 13) {
            onDetected?.(code);
            Quagga.stop();
          }
        });
        
      } catch (err) {
        console.error("Camera permission denied:", err);
        alert("Camera access denied. Please enable permissions.");
      }
      
    };
    
   // initScanner();
   //startScanner();
    
  useEffect(() => {
  startScanner();

  },[]);
  return(
  <div>
  <ErrorBoundary>
<div ref={scannerRef} style={{ width: "100%", height: "400px" }} >

      </div>
  </ErrorBoundary>
     </div>
);
}