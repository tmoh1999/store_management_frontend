import { useState } from "react";
import {addRefund} from "../api"
export default function AddRefund(){
    const [formData,setFormData]=useState({
        receipt_number:"",
        reason:""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");


    const handleChange=(e) => {
        const { name, value } = e.target;
        setFormData(prev =>({
            ...prev,
            [name]:value
        }));
    };
    

    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent page reload

      setError("");
      setLoading(true);

      try {
        console.log("formData");
          console.log(formData);
          const result =await addRefund(formData);
          
          result.success ? setMessage(result.message): setError(result.message) ;
          console.log(result.message);
      } catch (err) {
          setError(err.message || "addRefund failed");
      } finally {
          setLoading(false);
      }
    }    
    return(
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg  flex flex-col items-center gap-4 w-fit">
        {/* Message Box */}
          {message && (
            <div className="bg-green-100 text-green-700 p-2 rounded">{message}</div>
        )}

        <h1 className="text-2xl font-bold text-center">Add Refund</h1>
        {/* Error Box */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}
        
        <div className="mb-4">
          <label htmlFor="receipt_number" className="block text-sm text-gray-700 font-semibold">Receipt Number:</label>
          <input onChange={handleChange} value={formData.receipt_number} id="receipt_number" name="receipt_number" className="w-75 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required/>
        </div>
        

        <div className="mb-4">
            <label htmlFor="reason" className="block text-xl  text-gray-700 font-medium">Reason:</label>
            <div className="flex justify-center mt-1">
                <textarea id="reason" name="reason" 
                className="bg-gray-200 w-full h-20 max-h-24 text-lg p-1 rounded-xl shadow-lg text-center font-medium" 
                value={formData.reason} onChange={handleChange}/>
            </div>
        </div> 
    
  
        <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 font-medium text-xl rounded-xl w-2/4 hover:bg-blue-700">{loading ? "Adding..." : "Add"}</button>
      
      </form>
    </div>
    );
}