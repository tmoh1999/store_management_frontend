import { useLocation ,useNavigate} from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";
import NoDataFound from "../components/NoDataFound";

export default function PurchaseProfile(){
const {state}=useLocation();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [purchaseData,setPurchaseData]=useState({
    "id":null,
    "date":"",
    "total":"",
    "status":"",
    "description":""
});
const navigate=useNavigate();
useEffect(()=>{
    setError("");
    setLoading(true);
    apiGet("/api/purchases/search",{"purchase_id":state.id})
    .then(result => {
        if(!result?.success){
            setError(result.message);
            return;
        }
        setPurchaseData(prev => ({
            ...prev,
            id:result.purchase_id,
            date:result.purchase_date,
            total:result.total_amount,
            status:result.status,
            description:result.description
        }));
    }).catch(err => {
        setError(err.message);
    }).finally(()=>{
        setLoading(false);
    });
},[state]);

const handleClick=()=>{
    navigate("/purchases",{
        state:{
        id:purchaseData.id,
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
                    <h1 className="font-semibold text-2xl">Description Data:</h1>
                    {purchaseData?.status==="draft" && (
                        <button className="ml-3 p-1 mb-2 text-xl bg-green-600 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium"
                            onClick={handleClick}
                            >
                            Continue
                        </button>                    
                        )
                    }
                </div>
                <p className="text-lg"><span className="text-xl underline  mr-4">Date:</span>{purchaseData.date}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Total:</span>{purchaseData.total}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Status:</span>{purchaseData.status}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Description:</span>{purchaseData.description}</p>
            </div>
        </div>
        {purchaseData.id &&
            <div className="flex flex-col items-start">
            <DataTable
                mode="purchase_items"
                getOptions={{purchase_id:purchaseData.id}}
                TableName="Purchase Items"           
            />
            </div>       
        }
        </>
        )}
    </div>
);
}