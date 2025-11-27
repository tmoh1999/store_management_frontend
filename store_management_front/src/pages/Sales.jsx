import { Link ,useNavigate,useLocation} from "react-router-dom";
import { useEffect ,useState} from "react";
import {addSale} from "../api"
import SaleScreen from "./SaleScreen"
export default function Sales() {
const [sale_id,setSaleId]=useState(0)
const [saleStatus,setSaleStatus]=useState("")
const [openSaleScreen,setOpenSaleScreen]=useState(false)
 const handleClick= async () => {
     try{
         const result = await addSale()
         console.log(result);
         setSaleId(result.sale_id);
         setSaleStatus(result.sale_status);
         setOpenSaleScreen(true);
         
     }catch(err){
          console.log(err);
     }
 };
  return (
<div className="flex flex-col ">
<h1 className="p-1 text-3xl text-center font-bold ">Sales</h1>
<button className="self-start p-3 mb-3 text-2xl bg-green-500 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium"
onClick={handleClick}
>
Start Sale
</button>
{sale_id!==0 &&
<>
<h1 className="p-1 text-3xl text-center font-bold ">Sale:{sale_id}    status:{saleStatus}</h1>
<SaleScreen sale_id={sale_id} sale_status={saleStatus} setSaleId={setSaleId} />
</>
}

</div>

  );
}