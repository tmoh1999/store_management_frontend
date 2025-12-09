import { useEffect ,useState} from "react";
import {getPurchases,removeRow, savePurchaseRow} from "../api"
import TransactionScreen from "./TransactionScreen"
import Table from "../Table";
import StartPurchase from "./StartPurchase";
import DataTable from "../DataTable";
export default function Purchases() {
const [purchase_id,setPurchaseId]=useState(0)
const [openStartPurchase,setOpenStartPurchase]=useState(false);
const [reload,setReload]=useState(false);
const handleClick=  () => {
  setOpenStartPurchase(true);
};



useEffect(() => {
  if (purchase_id==0){
    setReload(prev => !prev);
  }
},[purchase_id]);
 
  return (
<div className="flex justify-center">


  {openStartPurchase ? (
    <StartPurchase setPurchaseID={setPurchaseId} setOpenStartPurchase={setOpenStartPurchase}/>
  ):(
    <div className=" p-2 w-fit mt-3">
      {purchase_id==0 ? (
      <>
        <div className="flex justify-end">
          <button onClick={handleClick} className="self-start p-3 mb-2 text-2xl bg-green-500 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium" to="/startpurchase">
          Start Purchase
          </button> 
        </div> 
        <DataTable
            mode="purchases"
            getOptions={{}}
            TableName={`Purchases`}
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