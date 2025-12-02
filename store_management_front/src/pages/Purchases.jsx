import { Link ,useNavigate,useLocation} from "react-router-dom";
import { useEffect ,useState} from "react";
import {addPurchase,getPurchases,removeRow} from "../api"
import TransactionScreen from "./TransactionScreen"
import Table from "../Table";
export default function Purchases() {
const [purchase_id,setPurchaseId]=useState(0)
const [purchaseStatus,setPurchaseStatus]=useState("")
const [reload,setReload]=useState(false);
const [purchases,setPurchases]=useState({
  columns: [],
  data: []
});
const handleClick= async () => {
    try{
        const result = await addSale()
        console.log(result);
        setPurchaseId(result.purchase_id);
        setPurchaseStatus(result.sale_status);

        
    }catch(err){
        console.log(err);
    }
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
<button className="self-start p-3 mb-3 text-2xl bg-green-500 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium"
onClick={handleClick}
>
Start Sale
</button>
{purchase_id==0 &&
<Table TableName="Purchases" data={purchases.data} columns={purchases.columns} rootpath="/api/purchases" removeRow={removeRow} 
  refreshParent={() => {
    setReload(prev => !prev);
  }}
/>
}
{purchase_id!==0 &&
<>
<h1 className="p-1 text-3xl text-center font-bold ">Sale:{purchase_id}    status:{purchaseStatus}</h1>
<TransactionScreen mode="purchase" transaction_id={purchase_id}  setTransactionId={setPurchaseId} setTransactionStatus={setPurchaseStatus}/>
</>
}

</div>

  );
}