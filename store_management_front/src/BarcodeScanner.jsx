import { useEffect, useRef ,useState } from "react";
import Quagga from "quagga";
import ErrorBoundary from "./ErrorBoundary";


export default function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState("");

  
   
    
    
  useEffect(() => {
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
              setError("Scanner init failed");
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
        setError("Camera access denied. Please enable permissions.");
      }
    
    };

    startScanner();
    return () => {
      Quagga.stop();
    };    
  },[]);
  return(
    <div>
      <ErrorBoundary>
        {/* Error Box */}
        {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}        
        <div ref={scannerRef} style={{ width: "100%", height: "400px" }} ></div>
      </ErrorBoundary>
    </div>
  );
}