import { Link } from "react-router-dom";
import { useEffect ,useState} from "react";
import {test,login} from "../api";
export default function Login() {
// Step 1: Create state for form fields
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    console.log(formData["username"]+"...."+formData["password"] );
    try {
  const result = await login(formData);

  // Save token
  localStorage.setItem("token", result.token);

  // Redirect (optional)
  // navigate("/dashboard");
} catch (err) {
  setError(err.message || "Login failed");
} finally {
      setLoading(false);
    }
    // Here you can call an API or do further processing
  };
  return (
    <div className="max-w-md mx-auto py-10 px-4">
    
    
      <form onSubmit={handleSubmit} className="bg-while p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
<h1 className="text-2xl font-bold text-center">Login</h1>
      
        
        
  <input name="username" className="border p-2 rounded-lg w-full" onChange={handleChange} required/>
  <input type="password" className="border p-2 rounded-lg w-full" onChange={handleChange}  name="password" required/>

  <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700">Login</button>
  

  <p>No account? <Link to="/register" className="ml-2 text-green-600 font-medium hover:underline">Register</Link>
</p>
      
      </form>
      
    </div>
  );
} 
