import { Link } from "react-router-dom";
import { useEffect ,useState} from "react";
import {addProduct} from "../api";
import ErrorBoundary from "../ErrorBoundary";
import BarcodeScanner from "../BarcodeScanner"
export default function AddProduct() {
// Step 1: Create state for form fields
  const [formData, setFormData] = useState({
    name: "",
    barcode:"",
    price:0.0,
  });
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [showScanner, setShowScanner] = useState(false);
const [message, setMessage] = useState("");

  // Step 2: Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Step 3: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    setError("");
    setLoading(true);
    
    try {
  const result =await addProduct(formData);
  
  setMessage(result.status);
  console.log(message);
} catch (err) {
  setError(err.message || "addProduct failed");
} finally {
      setLoading(false);
    }
    // Here you can call an API or do further processing
  }
  const startScanning = () => {
    setShowScanner(true);
  };
  const onDetected =(code)=> {
   console.log(code);
   setFormData({ ...formData, barcode: code });
   setShowScanner(false);
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-4/5 flex flex-col items-center gap-4">
      {/* Message Box */}
        {message && (
          <div className="bg-green-100 text-green-700 p-2 rounded">{message}</div>
        )}
<h1 className="text-2xl font-bold text-center">Add product</h1>
  {/* Error Box */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}
    <div className="mb-4">
  <label htmlFor="name" className="block text-sm text-gray-700 font-semibold">Name:</label>
  <input onChange={handleChange} value={formData.name} id="name" name="name" className="w-75 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
  </div>
  
  <div className="mb-4">
  <div className="mb-2">
  <label htmlFor="barcode" className="text-sm text-gray-700 font-semibold">Barcode:</label>
  <button onClick={startScanning} className="bg-green-600 text-white px-3 rounded-lg hover:bg-green-700 ml-2">
          Scan
   </button>
  </div>
  <input onChange={handleChange} value={formData.barcode} id="barcode" name="barcode" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
  
  </div>
  
  
  <div className="mb-4">
  <label htmlFor="price" className="block text-sm text-gray-700 font-semibold">Price:</label>
  <input onChange={handleChange} type="number" value={formData.price} id="price" name="price" className="w-75 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
  </div>
  
  
  
  <button type="submit" disabled={loading} className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700">{loading ? "Adding..." : "Add"}</button>
      
      </form>
      <ErrorBoundary>
      {showScanner && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-80">
      <h1>Scanned Code: {formData.barcode}</h1>
      <BarcodeScanner onDetected={onDetected} />
         <button 
              className="mt-3 bg-red-500 text-white p-2 rounded-lg w-full hover:bg-red-600"
              onClick={() => setShowScanner(false)}
            >
              Close
          </button>
      </div>
      </div>
      )}
      </ErrorBoundary>
    </div>
  );
} 
