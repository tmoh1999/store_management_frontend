import { useLocation,useNavigate } from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";
export default function RefundProfile(){
const {state}=useLocation();
const [reload,setReload]=useState(false);
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
    async function loadData(){
        console.log(state);
        const result= await apiGet("/api/refunds/search",{"refund_id":state.id});
        console.log(result)
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
    }
    loadData();

},[state,reload]);

const handleClick=()=>{
    if (refundData.status=="draft"){
            navigate("/refundscreen",{
              state:{
                refund_id:refundData.id,
                sale_id:refundData.sale_id,
              }
            });

    }
}
return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gray-100">
        <div className="flex justify-center">
            <div className="flex flex-col w-fit rounded-lg shadow-lg bg-white p-2 mt-8 ml-8">
                <div className="flex justify-start mb-3">
                    <h1 className="font-semibold text-2xl">Refund Data:</h1>
                    {refundData?.status=="draft" && (
                        <button className="ml-3 p-1 mb-2 text-xl bg-green-600 shadow-lg rounded-xl hover:bg-green-700 text-white  font-medium"
                            onClick={handleClick}
                            >
                            Continue Refund
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
                TableName={`Refund Items , Refund_id:${refundData.id}`}
                refreshParent2={() => {
                    setReload(prev => !prev);
                }}
            />
            </div>       
        }
    </div>
);
}