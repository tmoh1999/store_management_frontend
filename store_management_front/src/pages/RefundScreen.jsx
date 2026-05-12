import {addRefundItem, apiGet} from "../api"
import Table from "../Table";
import { useEffect ,useState} from "react";
import { useLocation } from "react-router-dom";
import DataTable from "../DataTable";
export default function RefundScreen(){
const {state}=useLocation();
const [tabledata,setTableData]=useState({
    columns:[
      { label: "ID", accessor: "id",edit:false},
      { label: "Barcode", accessor: "barcode",edit:false },
      { label: "Name", accessor: "name",edit:false },
      { label: "Unit Price", accessor: "price",edit:false },
      { label: "Quantity", accessor: "quantity",edit:false },
      { label: "Discount", accessor: "discount",edit:false },
      { label: "Discount Type", accessor: "discount_type",edit:false },
      { label: "Final Price", accessor: "final_price",edit:false },      
      { label: "Description", accessor: "description",edit:false },
    ],
    data:[]
});
  const [formData, setFormData] = useState({
    refund_quantity:0.0,
    refund_amount:0.0,
    refund_id:null,
    sale_item_id:null,
  });
const [openRefundEdit,setOpenRefundEdit]=useState(false);
const [page,setPage]=useState(1);
const [totalPages,setTotalPages]=useState(1);
const [search, setSearch] = useState("");
const [sortColumn, setSortColumn] = useState("__default__");
const [sortOrder, setSortOrder] = useState("desc");    
const [reload,setReload]=useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

// 1️⃣ API MAPPING BASED ON MODE
const api = {            

    add: null,
    update: null,
    remove: null,
    profilePath:"/",
    rootpath:"/api/sales/items",
    showDates:false,
}
useEffect(()=>{
    console.log("state:::",state.id);
        apiGet("/api/sales/sale_items",{"sale_id":state.sale_id})
        .then(result => {
            console.log(result);
            setTableData(prev => ({
                ...prev,
                data:result.results,
            }));
        setFormData(prev => ({
            ...prev,
            refund_id:state.refund_id,
        }));            
        });
},[state]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    setError("");
    setLoading(true);
    
    try {
      const result =await addRefundItem(formData);
        
      console.log(result.message);

      result.success? setMessage(result.message) : setError(result.message)
      setOpenRefundEdit(false);  
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
return (
<div>
    {!openRefundEdit? (
        <div className=" flex flex-col gap-3">

            <Table TableName="Refund Sale Items" removeRow={api.remove} saveRow={api.update} 
            mode="select"
            data={tabledata.data} columns={tabledata.columns}  rootpath={api.rootpath} 
            page={page} setPage={setPage} pages={totalPages}
            search={search} setSearch={setSearch}
            sortColumn={sortColumn} setSortColumn={setSortColumn}
            sortOrder={sortOrder} setSortOrder={setSortOrder}
            setSelectedRow={handleSelected}
            SelectName="Refund"
                refreshParent={() =>{
                    setReload(prev => !prev);
                }}/>

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
    ):(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            {/* <div className="overflow-y-auto p-2 bg-white shadow-lg rounded-lg h-2/5"> */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg  flex flex-col justify-center items-center gap-5">
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