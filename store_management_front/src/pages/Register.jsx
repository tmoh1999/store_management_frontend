import { Link , useNavigate} from "react-router-dom";
import { useState} from "react";
import {register} from "../api";
export default function Register() {
// Step 1: Create state for form fields
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
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
      const result = await register(formData);

      // Save token
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user.username);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration  failed");
    } finally {
      setLoading(false);
    }
    // Here you can call an API or do further processing
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-80 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        {/* Error Box */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}   
        <label htmlFor="username">Username</label>      
        <input onChange={handleChange} value={formData.username} id="username" name="username" className="border p-2 rounded-lg w-full"  required/>
        <label htmlFor="password">Password</label>          
        <input onChange={handleChange} value={formData.password} id="password" name="password" type="password" className="border p-2 rounded-lg w-full" required/>

        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700">{loading ? "Registering..." : "Register"}</button>      
        <p>Already have an account?
          <Link 
            to="/login" 
            className="ml-2 text-green-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
} 
