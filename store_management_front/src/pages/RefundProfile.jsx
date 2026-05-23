import { useLocation,useNavigate } from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";
import NoDataFound from "../components/NoDataFound";
export default function RefundProfile(){
const {state}=useLocation();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [refundData,setRefundData]=useState({
    "id":null,
    "sale_id":null,
    "date":"",
    "amount":"",
    "reason":"",
    "status":"",
    "receipt_number":""
});
const navigate=useNavigate();
useEffect(()=>{
    setError("");
    setLoading(true);
    apiGet("/api/refunds/search",{"refund_id":state.id})
    .then(result => {
        if(!result?.success){
            setError(result.message);
            return;
        }
        setRefundData(prev => ({
            ...prev,
            id:result.id,
            sale_id:result.sale_id,
            date:result.date,
            amount:result.amount,
            reason:result.reason,
            status:result.status,
            receipt_number:result.receipt_number
        }));
    }).catch(err => {
        setError(err.message);
    }).finally(()=>{
        setLoading(false);
    });
},[state]);

const handleClick=()=>{
    navigate("/refundscreen",{
        state:{
        refund_id:refundData.id,
        sale_id:refundData.sale_id,
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
                    <h1 className="font-semibold text-2xl">Refund Data:</h1>
                    {refundData?.status==="draft" && (
                        <button className="ml-3 p-1 mb-2 text-xl bg-green-600 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium"
                            onClick={handleClick}
                            >
                            Continue
                        </button>                    
                        )
                    }
                </div>
                <p className="text-lg"><span className="text-xl underline  mr-4">Date:</span>{refundData.date}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Amount:</span>{refundData.amount}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Receipt N°</span>{refundData.receipt_number}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Status:</span>{refundData.status}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Reason:</span>{refundData.reason}</p>
            </div>
        </div>
        {refundData.id &&
            <div className="flex flex-col items-start">
            <DataTable
                mode="refund_items"
                getOptions={{refund_id:refundData.id}}
                TableName="Refund Items"
            />
            </div>       
        }
        </>
        )}        
    </div>
);
}