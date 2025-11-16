import { Link } from "react-router-dom";
import { useEffect } from "react";
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
    console.log("Form submitted:", formData);
    // Here you can call an API or do further processing
  };
  return (
    <div className="max-w-2xl mx-auto py-10">
    <h2>Login</h2>
    {/*
      <form onSubmit="{handleSubmit}">

      <div className="flex flex-col items-center gap-4">
        
        <h2>Login</h2>
        
  <input name="username" className="border p-2 rounded w-full"  required/>
  <input type="password" className="border p-2 rounded w-full" name="password" required/>

  <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
  

  <p>No account? <Link to="/register"
          className="w-3/4 p-4 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
        >Register</Link>
</p>
      </div>
      </form>
      */}
    </div>
  );
} 