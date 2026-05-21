import { useEffect ,useState} from "react";
import {addTransaction,getEnumData} from "../api";
import CategoryDropdown from "../components/CategoryDropDown";
import { getLocalDate } from "../utils";
export default function AddTransaction() {
// Step 1: Create state for form fields
  const [formData, setFormData] = useState({
    type: "",
    note:"",
    category:"",
    category_id:null,
    date:getLocalDate(),
    amount:0.0,
  });
  const [TypeOptions,setTypeOptions]=useState([]);
  const [CategoryOptions,setCategoryOptions]=useState([]);
  const [filteredCategories,setFilteredCategories]=useState([]);
  const [selectedCategory,setSelectedCategory]=useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Step 2: Handle input changes
const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "type") {
    setSelectedCategory(null);

    setFormData(prev => ({
      ...prev,
      type: value,
      category: "",
      category_id: null
    }));

    return;
  }

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

  // Step 3: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setMessage("");
    setError("");
    setLoading(true);
    if (!formData.category_id) {
        setError("Please select a category");
        setLoading(false);
        return;
    }
    try {
      const result =await addTransaction(formData);
      if(result?.success){
        setMessage(result.message);
        setFormData({
          type: "",
          note:"",
          category:"",
          category_id:null,
          date:getLocalDate(),
          amount:0.0,
        });
        setSelectedCategory(null);
      }else{
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || "addTransaction failed");
    } finally {
      setLoading(false);
    }
    // Here you can call an API or do further processing
  }

  useEffect(()=>{
    getEnumData().then((data)=>{
      setTypeOptions(data.transaction_types);
      setCategoryOptions(data.transaction_categories);
      setFilteredCategories(data.transaction_categories);
    })
  },[]);
  
  
  useEffect(() => {
    if (!selectedCategory) return;

    setFormData(prev => ({
      ...prev,
      category: selectedCategory.value,
      category_id: selectedCategory.id || null,

      // 🔥 only infer type if it's empty
      type: prev.type || selectedCategory.type
    }));
  }, [selectedCategory]);




  useEffect(() => {
    if (!formData.type) {
      setFilteredCategories(CategoryOptions); // show all
      return;
    }

    setFilteredCategories(
      CategoryOptions.filter(cat => cat.type === formData.type)
    );
  }, [formData.type, CategoryOptions]);
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
                <CategoryDropdown options={filteredCategories} setOptions={setFilteredCategories}
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
