import { useLocation } from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";

export default function SaleProfile(){
const {state}=useLocation();
const [saleData,setSaleData]=useState({
    "id":null,
    "date":"",
    "total":"",
    "status":""
});
useEffect(()=>{
    async function loadData(){
        const result= await apiGet("/api/sales/search",{"sale_id":state.profile_id});
        setSaleData(prev => ({
            ...prev,
            id:result.sale_id,
            date:result.sale_date,
            total:result.total_amount,
            status:result.status
        }));
    }
    loadData();

},[state]);
return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gray-100">
        <div className="flex justify-center">
            <div className="flex flex-col w-fit rounded-lg shadow-lg bg-white p-2 mt-8 ml-8">
                <div className="flex justify-start mb-3">
                    <h1 className="font-semibold text-2xl">Sale Data:</h1>
                </div>
                <p className="text-lg"><span className="text-xl underline  mr-4">Date:</span>{saleData.date}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Total:</span>{saleData.total}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Status:</span>{saleData.status}</p>
            </div>
        </div>
        {saleData.id &&
            <div className="flex flex-col items-start">
            <DataTable
                mode="sale_items"
                getOptions={{sale_id:saleData.id}}
                TableName={`Sale Items , Sale_id:${saleData.id}`}
            />
            </div>       
        }
    </div>
);
}