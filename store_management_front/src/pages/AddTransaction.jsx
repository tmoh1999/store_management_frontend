import { Link } from "react-router-dom";
import { useEffect ,useState} from "react";
import ErrorBoundary from "../ErrorBoundary";
import {addTransaction,getEnumData} from "../api";
import CategoryDropdown from "../components/CategoryDropDown";
export default function AddTransaction() {
// Step 1: Create state for form fields
  const [formData, setFormData] = useState({
    type: "",
    note:"",
    category:"",
    category_id:null,
    date:new Date().toISOString().slice(0, 10),
    amount:0.0,
  });
  const [TypeOptions,setTypeOptions]=useState([]);
  const [CategoryOptions,setCategoryOptions]=useState([]);
  const [selectedCategory,setSelectedCategory]=useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      const result =await addTransaction(formData);

      setMessage(result.status);
      console.log(message);
    } catch (err) {
      setError(err.message || "addTransaction failed");
    } finally {
      setLoading(false);
    }
    // Here you can call an API or do further processing
  }
  useEffect(()=>{
    let cid= null;
    if (selectedCategory){
      console.log(Object.keys(selectedCategory));
      if (Object.keys(selectedCategory).includes("id")){
        cid=selectedCategory.id;
      }else{
        console.log("selectedCategory does not have id");
      }
    }
    setFormData((prev)=>({
      ...prev,
      category:selectedCategory ? selectedCategory.value : "",
      category_id:cid,
    }));
  },[selectedCategory]);


  useEffect(()=>{
    console.log(formData);
  },[formData]);
  useEffect(()=>{
    getEnumData().then((data)=>{
      console.log(data.transaction_types);
      console.log(data.transaction_categories);
      setTypeOptions(data.transaction_types);
      setCategoryOptions(data.transaction_categories);
    })
  },[]);


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg  flex flex-col justify-center items-center gap-5">
        {/* Message Box */}
          {message && (
            <div className="bg-green-100 text-green-700 p-2 rounded">{message}</div>
        )}

        <h1 className="text-2xl font-bold text-center">Add Transaction</h1>
        {/* Error Box */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}

        <div className="w-full">
            <label htmlFor="date" className="block text-xl  text-gray-700 font-medium">Date:</label>
            <div className="flex justify-center mt-1">
                <input type="date" id="date" name="date" 
                className="bg-gray-200 w-full text-xl p-1 rounded-xl shadow-lg text-center font-medium" 
                value={formData.date} onChange={handleChange}/>
            </div>
        </div>
        <div className="w-full">
            <label htmlFor="note" className="block text-xl  text-gray-700 font-medium">Note:</label>
            <div className="flex justify-center mt-1">
                <textarea id="note" name="note" 
                className="bg-gray-200 w-full h-20 max-h-24 text-lg p-1 rounded-xl shadow-lg text-center font-medium" 
                value={formData.note} onChange={handleChange}/>
            </div>
        </div>       
        <div className="w-full">   
            <label htmlFor="type" className="block text-xl  text-gray-700 font-medium">Type:</label>
            <div className="flex justify-center mt-1">
                <select id="type" name="type" 
                className="bg-gray-200 w-full text-xl p-1 rounded-xl shadow-lg text-center font-medium" 
                value={formData.type} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    {TypeOptions.map((type)=>(
                      <option key={type.value} value={type.value}>{type.value.charAt(0).toUpperCase() + type.value.slice(1)}</option>
                    ))}
                </select>
            </div>                
        </div>
        <div className="w-full">   
            <label htmlFor="category" className="block text-xl  text-gray-700 font-medium">Category:</label>
            <div className="flex justify-center mt-1">
                <CategoryDropdown options={CategoryOptions} setOptions={setCategoryOptions}
                selected={selectedCategory} setSelected={setSelectedCategory}/>
            </div>
        </div>

        <div className="w-full">
            <label htmlFor="amount" className="block text-xl  text-gray-700 font-medium">Amount:</label>
            <div className="flex justify-center mt-1 ">
                <input type="number" id="amount" name="amount" 
                className="bg-gray-200   text-xl p-1 rounded-xl shadow-lg text-center font-medium" 
                value={formData.amount} onChange={handleChange} step="0.01" required/>
            </div>
        </div>

        <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 font-medium text-xl rounded-xl w-2/4 hover:bg-blue-700">{loading ? "Adding..." : "Add"}</button>
      
      </form>
    </div>
  );


}
