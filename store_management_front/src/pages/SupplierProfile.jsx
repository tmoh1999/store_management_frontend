import { useLocation } from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";

export default function SupplierProfile(){
const {state}=useLocation();
const [supplierData,setSupplierData]=useState({
    "id":null,
    "name":"",
    "email":"",
    "phone":"",
});
useEffect(()=>{
    async function loadData(){
        const result= await apiGet("/api/suppliers/search",{"supplier_id":state.profile_id});
        setSupplierData(prev => ({
            ...prev,
            id:result.supplier_id,
            name:result.name,
            email:result.email,
            phone:result.phone,
        }));
    }
    loadData();

},[state]);
return (
    <div className="flex flex-col bg-gray-100">
        <div className="flex justify-center">
            <div className="flex flex-col w-fit rounded-lg shadow-lg bg-white p-2 mt-8 ml-8">
                <div className="flex justify-start mb-3">
                    <h1 className="font-semibold text-2xl">Description Data:</h1>
                </div>
                <p className="text-lg"><span className="text-xl underline  mr-4">Name:</span>{supplierData.name}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Phone:</span>{supplierData.phone}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Email:</span>{supplierData.email}</p>
            </div>
        </div>
        {supplierData.id &&
            <div className="flex flex-col items-start">
            <DataTable
                mode="purchases"
                getOptions={{supplier_id:supplierData.id}}
                TableName={`Purchases , supplier_id:${supplierData.id}`}
            />
            </div>       
        }
    </div>
);
}