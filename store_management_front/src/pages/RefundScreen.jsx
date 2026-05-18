import {addRefundItem, apiGet,confirmRefund,removeRow} from "../api"
import Table from "../Table";
import { useEffect ,useState} from "react";
import { useLocation ,useNavigate } from "react-router-dom";
import DataTable from "../DataTable";
export default function RefundScreen(){
const navigate=useNavigate();
const {state}=useLocation();
const [formData, setFormData] = useState({
    refund_quantity:0.0,
    refund_amount:0.0,
    refund_id:null,
    sale_item_id:null,
    sale_id:null,
});
const [openRefundEdit,setOpenRefundEdit]=useState(false);
const [reload,setReload]=useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

useEffect(()=>{
        console.log("state:::",state);
        setFormData(prev => ({
            ...prev,
            refund_id:state.refund_id,
            sale_id:state.sale_id
        }));      
},[state]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    setError("");
    setLoading(true);
    
    try {
      const result =await addRefundItem(formData);
        
      console.log(result.message);

      result.success? setMessage(result.message) : setError(result.message)
      if(result?.success){
        setMessage(result.message);
        setError("");
        setOpenRefundEdit(false);  
      }else{
        setError(result.message);
        setMessage("");
      }
    } catch (err) {
      setError(err.message || "addRefundItem failed");
    } finally {
      setLoading(false);
    }
    // Here you can call an API or do further processing
  }
  useEffect(()=>{
    console.log(formData);
  },[formData]);

const handleSelected= (row) => {
    if (row.id){
        setOpenRefundEdit(true);
        setFormData(prev => ({
            ...prev,
            sale_item_id:row.id
        }));
    }
};

const handleChange=(e) => {
    const { name, value } = e.target;
    setFormData(prev =>({
        ...prev,
        [name]:value
    }));
};

const CancelClick = async () => {
   try {
       if (formData?.refund_id){
        const path="/api/refunds/"+formData.refund_id+"/remove";
        const result=await removeRow(path);
        if(result?.success){
            // redirect to /refunds
            navigate("/refunds");
        }
       }
       
   }catch(err){
       setError(err.message);
   }
};

const ConfirmClick = async () => {
   try {
       if (formData?.refund_id){
        const result=await confirmRefund(formData.refund_id); 
        if(result?.success){
            // redirect to /refunds
            navigate("/refunds");
        }        
       }
       
   }catch(err){
       setError(err.message);
   }
};

return (
<div>
    {!openRefundEdit? (
        
        <div className=" flex flex-col justify-center items-center gap-3">
        
        <div className="w-3/4 mt-10">    
            <h1 className="text-4xl font-bold underline">Refund Sale Screen</h1>
            {/* Message Box */}
            {message && (
                <div className="bg-green-100 text-green-700 p-2 rounded">{message}</div>
            )}
            {/* Error Box */}
            {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
            )}             
            <DataTable
                mode="sale_items"
                table_mode="select"
                TableName="Refund Sale Items"
                setSelectedRow={handleSelected}
                getOptions={{sale_id:formData.sale_id}}
                SelectName="Refund"
            />    
            <div className=" flex justify-center mt-8">
                <button className="mr-10 mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-green-500 hover:bg-green-600 "
                onClick={ConfirmClick}
                >💾 Confirm</button>

                <button className="ml-10 mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-red-500 hover:bg-red-600 "
                onClick={CancelClick}
                >❌ Cancel</button>
            </div>
            {formData.refund_id && 
                (    
                    <DataTable
                        mode="refund_items"
                        getOptions={{refund_id:formData.refund_id}}
                        TableName={`Refund Items , Refund_id:${formData.refund_id}`}
                        refreshParent2={() => {
                            setReload(prev => !prev);
                        }}
                />
                )
            }    
        </div>
        </div>
    ):(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            {/* <div className="overflow-y-auto p-2 bg-white shadow-lg rounded-lg h-2/5"> */}

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg  flex flex-col justify-center items-center gap-5">
                    <div className="flex w-full justify-end">
                        <button onClick={() => {setOpenRefundEdit(false);setError("");setMessage("");}} className="ml-3 font-bold">✕</button>
                    </div>
                    {/* Message Box */}
                    {message && (
                        <div className="bg-green-100 text-green-700 p-2 rounded">{message}</div>
                    )}

                    <h1 className="text-2xl font-bold text-center">Add Refund</h1>
                    {/* Error Box */}
                    {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
                    )}                    
                    <div className="w-full">
                        <label htmlFor="refund_quantity" className="block text-xl  text-gray-700 font-medium">Refund Quantity</label>
                        <div className="flex justify-center mt-1">
                            <input type="number" id="refund_quantity" name="refund_quantity" 
                            value={formData.refund_quantity} onChange={handleChange}
                            className="bg-gray-200 w-full text-xl p-1 rounded-xl shadow-lg text-center font-medium" />
                        </div>
                    </div>
                    <div className="w-full">
                        <label htmlFor="refund_amount" className="block text-xl  text-gray-700 font-medium">Refund Amount</label>
                        <div className="flex justify-center mt-1">
                            <input type="number" id="refund_amount" name="refund_amount" 
                            value={formData.refund_amount} onChange={handleChange}
                            className="bg-gray-200 w-full text-xl p-1 rounded-xl shadow-lg text-center font-medium" />
                        </div>
                    </div>                    
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 font-medium text-xl rounded-xl w-2/4 hover:bg-blue-700">{loading ? "Adding..." : "Add"}</button>
                </form>
            {/* </div>     */}

        </div>
    )
    }
</div>
);
}