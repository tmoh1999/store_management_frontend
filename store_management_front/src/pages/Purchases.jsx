import { Link ,useNavigate,useLocation} from "react-router-dom";
import { useEffect ,useState} from "react";
import {addPurchase,getPurchases,removeRow} from "../api"
import TransactionScreen from "./TransactionScreen"
import Table from "../Table";
import StartPurchase from "./StartPurchase";
export default function Purchases() {
const [purchase_id,setPurchaseId]=useState(0)
const [purchaseStatus,setPurchaseStatus]=useState("")
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
<div className="flex flex-col p-2 ">

  {openStartPurchase ? (
    <StartPurchase setPurchaseID={setPurchaseId} setOpenStartPurchase={setOpenStartPurchase}/>
  ):(
      purchase_id==0 ? (
      <>
        <button onClick={handleClick} className="self-start p-3 mb-3 text-2xl bg-green-500 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium" to="/startpurchase">
        Start Purchase
        </button>  
        <Table TableName="Purchases" data={purchases.data} columns={purchases.columns} rootpath="/api/purchases" removeRow={removeRow} 
          refreshParent={() => {
            setReload(prev => !prev);
          }}
        />
      </>

      ):(
      <>
        <button onClick={handleClick} className="self-start p-3 mb-3 text-2xl bg-green-500 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium" to="/startpurchase">
        Start Purchase
        </button>
        <h1 className="p-1 text-3xl text-center font-bold ">Purchase:{purchase_id}    status:{purchaseStatus}</h1>
        <TransactionScreen mode="purchase" transaction_id={purchase_id}  setTransactionId={setPurchaseId} setTransactionStatus={setPurchaseStatus}/>
      </>
      )

  )
  }
</div>

  );
}