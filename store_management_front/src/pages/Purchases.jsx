import { useEffect ,useState , useRef} from "react";
import TransactionScreen from "./TransactionScreen"
import StartPurchase from "./StartPurchase";
import DataTable from "../DataTable";
import {useLocation} from "react-router-dom";
export default function Purchases() {
  const {state}=useLocation();
const [purchase_id,setPurchaseId]=useState(0)
const [openStartPurchase,setOpenStartPurchase]=useState(false);
const [refreshKey,setRefreshKey]=useState(0);
const isFirstRender = useRef(true);
useEffect(() => {
  if(state?.id){
    setPurchaseId(state.id);
  }
},[state]);


useEffect(() => {
  if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
  }
  if (purchase_id===0){
    setRefreshKey(prev => prev + 1);
  }
},[purchase_id]);
 
  return (
<div className="flex justify-center">


  {openStartPurchase ? (
    <StartPurchase setPurchaseID={setPurchaseId} setOpenStartPurchase={setOpenStartPurchase}/>
  ):(
    <div className=" p-2 w-fit mt-3">
      {purchase_id===0 ? (
      <>
        <div className="flex justify-end">
          <button type="button" onClick={() => setOpenStartPurchase(true)} className="self-start p-3 mb-2 text-2xl bg-green-500 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium">
          Start Purchase
          </button> 
        </div> 
        <DataTable
            mode="purchases"
            getOptions={{}}
            TableName="Purchases"
            Edit={true}
            refreshKey={refreshKey}
        />  
      </>

      ):(
      <> 
        <TransactionScreen mode="purchase" transaction_id={purchase_id}  setTransactionId={setPurchaseId}/>
      </>
      )}
   </div>   
  )
  }
</div>
  );
}