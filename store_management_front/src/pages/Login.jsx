import { Link } from "react-router-dom";
import { useEffect ,useState} from "react";
import {test} from "../api";
export default function Login() {
// Step 1: Create state for form fields
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  // Step 2: Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Step 3: Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log(formData);
    
    // Here you can call an API or do further processing
  };
  return (
    <div className="max-w-md mx-auto py-10 px-4">
    
    <h1>Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">

      
        
        
  <input name="username" className="border p-2 rounded-lg w-full"  required/>
  <input type="password" className="border p-2 rounded-lg w-full" name="password" required/>

  <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700">Login</button>
  

  <p>No account? <Link to="/register" className="ml-2 text-green-600 font-medium hover:underline">Register</Link>
</p>
      
      </form>
      
    </div>
  );
} 
