import { useEffect ,useState} from "react";
import {getPurchases,removeRow, savePurchaseRow} from "../api"
import TransactionScreen from "./TransactionScreen"
import Table from "../Table";
import StartPurchase from "./StartPurchase";
export default function Purchases() {
const [purchase_id,setPurchaseId]=useState(0)
const [openStartPurchase,setOpenStartPurchase]=useState(false);
const [reload,setReload]=useState(false);
const [purchases,setPurchases]=useState({
  columns: [],
  data: []
});
const handleClick=  () => {
  setOpenStartPurchase(true);
};

useEffect(()=>{
  getPurchases()
  .then(result => {
    console.log(result.results);
    setPurchases(prev => ({
      ...prev,
      columns:[
          { label: "ID", accessor: "id" ,edit:false },
          { label: "Date", accessor: "date" ,edit:false },
          { label: "total", accessor: "total" ,edit:false },
          { label: "Status", accessor: "status" ,edit:false },
          { label: "Description", accessor: "description" ,edit:true },
      ],
      data:result.results,
    }));
  });

},[reload])

useEffect(() => {
  console.log(purchase_id);
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
        <Table TableName="Purchases" data={purchases.data} columns={purchases.columns} rootpath="/api/purchases" saveRow={savePurchaseRow} removeRow={removeRow} 
          refreshParent={() => {
            setReload(prev => !prev);
          }}
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