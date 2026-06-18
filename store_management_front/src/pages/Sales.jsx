import { useLocation} from "react-router-dom";
import { useEffect ,useRef,useState} from "react";
import {addSale,updateSale} from "../api"
import TransactionScreen from "./TransactionScreen"
import DataTable from "../DataTable";
export default function Sales() {
const {state}=useLocation();
const [sale_id,setSaleId]=useState(0)
const [customerSelected,setCustomerSelected]=useState(null);
const [openCustomerSelectMenu,setOpenCustomerSelectMenu]=useState(false);
const [refreshKey,setRefreshKey]=useState(0);
const isFirstRender = useRef(true);
const [error, setError] = useState("");
const handleClick= async () => {
    try{
        const result = await addSale()
        if(!result?.success){
          setError(result?.message || "API ERROR");
          return;
        }
        setSaleId(result.sale_id);
        
    }catch(err){
        setError(err?.message || "API ERROR");
    }
};



useEffect(() => {
  if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
  }
  if (sale_id===0){
    setRefreshKey(prev => prev + 1);
  }
},[sale_id]);

useEffect(() => {
  if(state?.id){
    setSaleId(state.id);
  }
},[state]);
 
useEffect(()=>{
  if(customerSelected?.id){
    setOpenCustomerSelectMenu(false);
    
    updateSale(sale_id,customerSelected.id)
    .then(result => {
        if(!result?.success){
          setError(result?.message || "API ERROR");
        }       
    }).catch(err => {
        setError(err.message);
    });
  }
} 
,[customerSelected]);
  return (
<div className="flex justify-center min-w-fit p-3">  
  <div className="flex flex-col p-2 sm:w-3/4 min-w-[700px] ">
  {/* Error Box */}
  {error && (
  <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
  )}   
  {sale_id===0? 
    (
      <>
        <div className="flex justify-end"> 
          <button className="self-start p-3 mb-2 text-2xl bg-green-500 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium"
          onClick={handleClick}
          >
          Start Sale
          </button>
        </div>
        
        <DataTable
          mode="sales" TableName="Sales" Edit={true} refreshKey={refreshKey}
        />  
      </>
    ):openCustomerSelectMenu? 
      (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="h-screen overflow-y-auto p-2 bg-white shadow-lg rounded-lg">
              <DataTable
                  mode="customers"
                  table_mode="select"
                  TableName="Select Customer"
                  setSelectedRow={setCustomerSelected}
              />
          </div>     
        </div>
      )
      :
      (
        <>
          <div>
            <button className="mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-blue-600 hover:bg-blue-800 "
              onClick={()=>{setOpenCustomerSelectMenu(true);}}
            >
            Choose Customer
            </button>    
          </div>          
          <TransactionScreen mode="sale" transaction_id={sale_id}  setTransactionId={setSaleId}/>
        </>
      ) 
  }  
  

  </div>
</div>

  );
}