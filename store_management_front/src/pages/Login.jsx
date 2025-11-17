import { Link , useNavigate} from "react-router-dom";
import { useEffect ,useState} from "react";
import {login} from "../api";
export default function Login() {
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
    console.log(formData["username"]+"...."+formData["password"] );
    setError("");
    setLoading(true);
    try {
  const result = await login(formData);

  // Save token
  localStorage.setItem("token", result.token);
  console.log(result.token)
  console.log(result.user)
  // Redirect (optional)
  const user={
        username:result.user.username,
  };
   navigate("/dashboard",{
   state:user,
   });
} catch (err) {
  setError(err.message || "Login failed");
} finally {
      setLoading(false);
    }
    // Here you can call an API or do further processing
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    
    
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-80 flex flex-col items-center gap-4">
<h1 className="text-2xl font-bold text-center">Login</h1>
  {/* Error Box */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}
        
        
  <input onChange={handleChange} name="username" className="border p-2 rounded-lg w-full"  required/>
  <input onChange={handleChange} type="password" className="border p-2 rounded-lg w-full"   name="password" required/>

  <button type="submit" disabled={loading} className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700">{loading ? "Logging in..." : "Login"}</button>
  

  <p>No account? <Link to="/register" className="ml-2 text-green-600 font-medium hover:underline">Register</Link>
</p>
      
      </form>
      
    </div>
  );
} 
