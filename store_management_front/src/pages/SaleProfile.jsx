import { useLocation,useNavigate } from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";
import NoDataFound from "../components/NoDataFound";
export default function SaleProfile(){
const {state}=useLocation();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [saleData,setSaleData]=useState({
    "id":null,
    "date":"",
    "total":"",
    "total_discount":"",
    "final_amount":"",
    "status":"",
    "customer":""
});
const navigate=useNavigate();
useEffect(()=>{
    setError("");
    setLoading(true);
    apiGet("/api/sales/search",{"sale_id":state.id})
    .then(result => {
        if(!result?.success){
            setError(result.message);
            return;
        }
        setSaleData(prev => ({
            ...prev,
            id:result.sale_id,
            date:result.sale_date,
            total:result.total_amount,
            total_discount:result.total_discount,
            final_amount:result.final_amount,
            status:result.status,
            customer:result.customer
        }));
    }).catch(err => {
        setError(err.message);
    }).finally(()=>{
        setLoading(false);
    });
},[state]);

const handleClick=()=>{
    navigate("/sales",{
        state:{
        id:saleData.id,
        }
    });
}
return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gray-100">
        {loading?(
        <div className="flex flex-col  h-screen justify-center items-center p-6 bg-gray-400">  
            <div className="w-3/4">
                <NoDataFound message="Loading..."/>
            </div>
        </div>        
        ):error?(
            <div className="flex flex-col  h-screen justify-center items-center p-6 bg-gray-400">  
            <div className="w-3/4">
                <NoDataFound message={error}/>
            </div>
            </div>
        ):(
        <>            
        <div className="flex justify-start">
            <div className="flex flex-col w-2/5 rounded-lg shadow-lg bg-white p-2 mt-8 ml-8">
                <div className="flex justify-start mb-3">
                    <h1 className="font-semibold text-2xl">Sale Data:</h1>
                    {saleData?.status==="draft" && (
                        <button className="ml-3 p-1 mb-2 text-xl bg-green-600 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium"
                            type="button" onClick={handleClick}
                            >
                            Continue
                        </button>                    
                        )
                    }
                </div>
                <p className="text-lg"><span className="text-xl underline  mr-4">Date:</span>{saleData.date}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Total:</span>{saleData.total}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Discounts:</span>{saleData.total_discount}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Final Amount:</span>{saleData.final_amount}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Status:</span>{saleData.status}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Customer:</span>{saleData.customer}</p>
            </div>
        </div>
        {saleData.id &&
            <div className="flex flex-col items-start">
            <DataTable
                mode="sale_items"
                getOptions={{sale_id:saleData.id}}
                TableName="Sale Items"
            />
            </div>       
        }
        </>
        )}               
    </div>
);
}