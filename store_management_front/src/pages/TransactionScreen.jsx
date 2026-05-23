import {apiGet,addSaleItem,updateSaleItem,removeRow,confirmSale,addPurchaseItem,updatePurchaseItem,confirmPurchase, searchProduct} from "../api"
import { useEffect ,useState} from "react";
import TableCell from "../TableCell"
import DataTable from "../DataTable";
import BarcodeScanner from "../BarcodeScanner";
export default function TransactionScreen({mode,transaction_id,setTransactionId}){
const [openSelectMenu,setOpenSelectMenu]=useState(false);
const [showScanner, setShowScanner] = useState(false);
const [error, setError] = useState("");
const [total,setTotal]=useState(0);
const [refreshKey,setRefreshKey]=useState(0);
const [formData, setFormData] = useState(
    mode === "sale" ? {
        product_id: null,
        barcode: "",
        name: "",
        description: "",
        quantity: 1,
        price: 0.0,
        discount: 0.0,
        discount_type: "percentage",
    } : {
        product_id: null,
        barcode: "",
        name: "",
        latest_purchase_price: "??",
        quantity: 1,
        price: 0.0,
    }
); 
// 1️⃣ API MAPPING BASED ON MODE
const api = {
  sale: {
    addItem: addSaleItem,
    datamod:"sale_items",
    options:{sale_id:transaction_id},
    tablename:"Sale Items",
    confirm: confirmSale,
    remove:removeRow
  },
  purchase: {
    addItem: addPurchaseItem,
    datamod:"purchase_items",
    options:{purchase_id:transaction_id},
    tablename:"Purchase Items",
    confirm: confirmPurchase,
    remove:removeRow
  }
}[mode];

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
const handleClick = async () => {
   try {
       const result=await api.addItem(formData,transaction_id,formData.product_id);
       if(!result?.success){
          setError(result?.message  || `add ${mode} item failed`);
          return;
       }
   }catch(err){
      setError(err?.message  || `add ${mode} item failed`);
   }finally{
      setRefreshKey(prev=> prev+1);
   }
};

const CancelClick = async () => {
   try {
   	const path=mode==="sale" ? "/api/sales/"+transaction_id+"/remove" : "/api/purchases/"+transaction_id+"/remove";
       const result=await api.remove(path);
       if(!result?.success){
          setError(result?.message  || `cancel ${mode} failed`);
          return;
       }       
       setTransactionId(0);
       
   }catch(err){
       setError(err?.message  || `cancel ${mode} failed`);
   }
};

const ConfirmClick = async () => {
  try {

    const result=await api.confirm(transaction_id);
    if(!result?.success){
      setError(result?.message  || `confirm ${mode} failed`);
      return;
    }         

    setTransactionId(0);
      
  }catch(err){
    setError(err?.message  || `confirm ${mode} failed`);
  }
};



const changeProduct=(row)=>{
  setFormData(prev => ({
    ...prev,
    product_id:row.id,
    name:row.name,
    barcode:row.barcode,
    price:row.price,
  }));
  setOpenSelectMenu(false);
};
useEffect (()=>{
  if (mode==="purchase"){
    apiGet("/api/products/latest_purchase_price",{product_id:formData.product_id})
    .then(result => {
      if(!result?.success){
        setError(result?.message  || "loading latest_purchase_price data failed.");
        return;
      }         
      setFormData(prev =>({
        ...prev,
        latest_purchase_price:(result.success && result.purchase_price>0)? String(result.purchase_price) : "??",
      }));
    })
    .catch(err=>{
      setError(err?.message  || "loading latest_purchase_price data failed.");
    });
  }
},[formData.product_id]);


const onDetected = async (code)=> {
  
  setShowScanner(false);
  try{
    const result=await searchProduct("barcode",code)
    if(result?.success){
      setFormData(prev => ({
        ...prev,
        barcode:result.product_barcode,
        name:result.product_name,
        product_id:result.product_id,
      }));
    }else{
      setError(result?.message  || `scanning barcode failed.`);
      return;
    }
  }catch(error){
    setError(error?.message  || `scanning barcode failed.`);
  }
};
return (
<div>
  {/* Error Box */}
  {error && (
    <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
  )}  
  {openSelectMenu ? (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="h-screen overflow-y-auto shadow-lg rounded-lg bg-white p-2">
      <DataTable mode="products" table_mode="select" setSelectedRow={changeProduct} TableName="Select Product:"/>
    </div>  
  </div>
  ):(
  <>
  <div className="mt-2 flex flex-col items-center justify-center ">
    <div className="w-fit">
      <h1 className="p-1 text-3xl text-center font-bold ">{mode==="purchase" ? "Purchase:": "Sale:"}{transaction_id}    Total:{total}</h1>
      <table className="w-auto shadow-md">
      <thead >
        <tr className="bg-gray-200">
                          <th></th>
                          <th className="p-3 cursor-pointer border">Name</th>
                          <th className="p-3 cursor-pointer border">Barcode</th>
                          {mode==="purchase" &&
                            (
                              <>

                                <th className="p-3 cursor-pointer border">Latest Purchase</th>
                              
                              </>
                            )
                          }  
                          <th className="p-3 cursor-pointer border">Price</th>
                          <th className="p-3 cursor-pointer border">Quantity</th>
                          {mode==="sale" &&
                            (
                              <>

                                <th className="p-3 cursor-pointer border">Discount</th>
                                <th className="p-3 cursor-pointer border">Discount Type</th>                    
                                <th className="p-3 cursor-pointer border">Description</th>
                              
                              </>
                            )
                          }  
                          

                          
        </tr>
      </thead>

      <tbody>
          <tr className="bg-gray-100">
                          <td>            
                            <button type="button" onClick={() => setShowScanner(true)} className="bg-green-600 text-white px-3 rounded-lg hover:bg-green-700 ml-2">
                            Scan
                            </button>
                          </td>
                          <TableCell Editable={false} val={formData.name}/>
                          <TableCell Editable={false} val={formData.barcode}/>
                          {
                            mode==="purchase" && (
                              <>
                                <TableCell Editable={false} val={formData.latest_purchase_price}/>
                              </>
                            )
                          }
                          <TableCell Editable={true} val={formData.price} type="number" name="price" onChanged={handleChange}/>
                          <TableCell Editable={true} val={formData.quantity} type="number" name="quantity" onChanged={handleChange}/>
                          {mode==="sale" &&
                            (
                              <>
                              <TableCell Editable={true} val={formData.discount} type="number" name="discount" onChanged={handleChange}/>
                              <td className="p-1 border">
                                <select id="type" name="discount_type" 
                                className="bg-blue-200  w-full text-xl  rounded-lg shadow-lg text-center" 
                                value={formData.discount_type} onChange={handleChange}>
                                    <option value="percentage">Percentage</option>
                                    <option value="per_item">Per_Item</option>
                                    <option value="fixed">Fixed</option>
                                </select> 
                              </td>                       
                              <TableCell Editable={true} val={formData.description} type="text" name="description" onChanged={handleChange}/>
                              </>
                            )
                          }    
                          
                          
                          
          </tr>
      </tbody>
      </table>

      <div className=" mt-2 flex justify-between ">
        <button className="mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-green-500 hover:bg-green-600 "
        type="button" onClick={()=>{setOpenSelectMenu(true);}}
        >select product</button>
        <button className="mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-blue-500 hover:bg-blue-600 "
        type="button" onClick={handleClick}
        >➕ Add Item</button>
      </div>
    </div>

    <div className="mt-8">
      <button className="mr-10 mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-green-500 hover:bg-green-600 "
      type="button" onClick={ConfirmClick}
      >💾 Confirm</button>

      <button className="ml-10 mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-red-500 hover:bg-red-600 "
      type="button" onClick={CancelClick}
      >❌ Cancel</button>
    </div>
    <div className="mt-2">
      <DataTable
          mode={api.datamod}
          getOptions={api.options}
          TableName={api.tablename}
          refreshKey={refreshKey}
          setTotal={setTotal}
          Edit={true}
      />
        
    </div>
  </div>
  </>
  )
  }
    {showScanner && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg w-80">
    <h1>Scanned Code: {formData.barcode}</h1>
    <BarcodeScanner onDetected={onDetected} />
        <button 
            className="mt-3 bg-red-500 text-white p-2 rounded-lg w-full hover:bg-red-600"
            type="button" onClick={() => setShowScanner(false)}
          >
            Close
        </button>
    </div>
    </div>
    )}
</div>
);
}