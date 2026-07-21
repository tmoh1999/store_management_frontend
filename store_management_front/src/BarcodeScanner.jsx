import { useEffect, useRef ,useState } from "react";
import Quagga from "quagga";
import ErrorBoundary from "./ErrorBoundary";


export default function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState("");

  
   
    
    
  useEffect(() => {
    let started=false;
    const startScanner = async () => {
      
      if (!scannerRef.current) return;

          
      try 
      {
        await navigator.mediaDevices.getUserMedia({ video: true });
  
        if (!scannerRef.current) return;
        
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
              console.error("Quagga init error:", err.name, err.message, err);

              switch (err.name) {
                case "NotAllowedError":
                  setError("Camera permission denied");
                  break;
                case "NotFoundError":
                  setError("No camera found on this device");
                  break;
                case "OverconstrainedError":
                  setError("Camera doesn't support requested settings");
                  break;
                default:
                  setError(err.message || "Error initializing camera");
              }
              return;
            }
            Quagga.start();
            started=true;
          }
        );

        Quagga.onDetected((data) => {
          const code = data?.codeResult?.code;
          if (code && code.length === 13) {
            onDetected?.(code);
            Quagga.stop();
            started=false;
          }
        });
        
      } catch (err) {
        setError("Camera access denied. Please enable permissions.");
      }
    
    };

    startScanner();
    return () => {
      if(started) Quagga.stop();
    };    
  },[]);
  return(
    <div>
      <ErrorBoundary>
        {/* Error Box */}
        {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}        
        <div ref={scannerRef} 
         style={{ width: "100%", height: "400px" }}
         ></div>
      </ErrorBoundary>
    </div>
  );
}