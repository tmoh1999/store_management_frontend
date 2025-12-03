import { useState } from "react";
import {addSupplier} from "../api"
export default function AddSupplier(){
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        phone:""
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
        const result =await addSupplier(formData);

        setMessage(result.status);
        console.log(message);
    } catch (err) {
        setError(err.message || "addSupplier failed");
    } finally {
        setLoading(false);
    }
    // Here you can call an API or do further processing
    }    
    return(
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-4/5 flex flex-col items-center gap-4 w-fit">
        {/* Message Box */}
          {message && (
            <div className="bg-green-100 text-green-700 p-2 rounded">{message}</div>
        )}

        <h1 className="text-2xl font-bold text-center">Add Supplier</h1>
        {/* Error Box */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm text-gray-700 font-semibold">Name:</label>
          <input onChange={handleChange} value={formData.name} id="name" name="name" className="w-75 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required/>
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm text-gray-700 font-semibold">Email:</label>
          <input onChange={handleChange} type="email" value={formData.email} id="email" name="email" className="w-75 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required/>
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm text-gray-700 font-semibold">Phone:</label>
          <input onChange={handleChange} type="tel" value={formData.phone} name="phone" className="w-75 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required/>
        </div>
    
  
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700">{loading ? "Adding..." : "Add"}</button>
      
      </form>
    </div>
    );
}