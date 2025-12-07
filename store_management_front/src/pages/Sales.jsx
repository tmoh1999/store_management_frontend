import { Link ,useNavigate,useLocation} from "react-router-dom";
import { useEffect ,useState} from "react";
import {addSale,getSales,removeRow} from "../api"
import TransactionScreen from "./TransactionScreen"
import Table from "../Table";
export default function Sales() {
const [sale_id,setSaleId]=useState(0)
const [openSaleScreen,setOpenSaleScreen]=useState(false)
const [reload,setReload]=useState(false);
const [sales,setSales]=useState({
  columns: [],
  data: []
});
const handleClick= async () => {
    try{
        const result = await addSale()
        console.log(result);
        setSaleId(result.sale_id);
        setOpenSaleScreen(true);
        
    }catch(err){
        console.log(err);
    }
};

useEffect(()=>{
  getSales()
  .then(result => {
    console.log(result.results);
    setSales(prev => ({
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
  console.log(sale_id);
  if (sale_id==0){
    setReload(prev => !prev);
  }


},[sale_id]);
 
  return (
<div className="flex justify-center p-3">    
  <div className="flex flex-col p-2 w-fit ">
   {sale_id==0 &&
   <>
   <div className="flex justify-end"> 
    <button className="self-start p-3 mb-2 text-2xl bg-green-500 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium"
    onClick={handleClick}
    >
    Start Sale
    </button>
  </div>
  
  <Table TableName="Sales" data={sales.data} columns={sales.columns} rootpath="/api/sales" removeRow={removeRow} 
    refreshParent={() => {
      setReload(prev => !prev);
    }}
  />
  </>
  }
  {sale_id!==0 &&
  <>
  <TransactionScreen mode="sale" transaction_id={sale_id}  setTransactionId={setSaleId}/>
  </>
  }

  </div>
</div>

  );
}