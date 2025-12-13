import { useLocation } from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";

export default function PurchaseProfile(){
const {state}=useLocation();
const [reload,setReload]=useState(false);
const [purchaseData,setPurchaseData]=useState({
    "id":null,
    "date":"",
    "total":"",
    "status":"",
    "description":""
});
useEffect(()=>{
    async function loadData(){
        const result= await apiGet("/api/purchases/search",{"purchase_id":state.profile_id});
        setPurchaseData(prev => ({
            ...prev,
            id:result.purchase_id,
            date:result.purchase_date,
            total:result.total_amount,
            status:result.status,
            description:result.description
        }));
    }
    loadData();

},[state,reload]);
return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gray-100">
        <div className="flex justify-center">
            <div className="flex flex-col w-fit rounded-lg shadow-lg bg-white p-2 mt-8 ml-8">
                <div className="flex justify-start mb-3">
                    <h1 className="font-semibold text-2xl">Description Data:</h1>
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
                TableName={`Purchase Items , Purchase_id:${purchaseData.id}`}
                refreshParent2={() => {
                    setReload(prev => !prev);
                }}                

            />
            </div>       
        }
    </div>
);
}