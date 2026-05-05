import { useLocation } from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";

export default function CustomerProfile(){
const {state}=useLocation();
const [reload,setReload]=useState(false);
const [customerData,setCustomerData]=useState({
    "id":null,
    "name":"",
    "email":"",
    "phone":"",
});
useEffect(()=>{
    async function loadData(){
        const result= await apiGet("/api/customers/search",{"customer_id":state.profile_id});
        console.log(result)
        setCustomerData(prev => ({
            ...prev,
            id:result.customer_id,
            name:result.name,
            email:result.email,
            phone:result.phone,
        }));
    }
    loadData();

},[state,reload]);
useEffect(()=>{
    console.log(customerData);
},[customerData]);
return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gray-100">
        <div className="flex justify-center">
            <div className="flex flex-col w-fit rounded-lg shadow-lg bg-white p-2 mt-8 ml-8">
                <div className="flex justify-start mb-3">
                    <h1 className="font-semibold text-2xl">Description Data:</h1>
                </div>
                <p className="text-lg"><span className="text-xl underline  mr-4">Name:</span>{customerData.name}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Phone:</span>{customerData.phone}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Email:</span>{customerData.email}</p>
            </div>
        </div>
        {customerData.id && 
            <div className="flex flex-col items-start">
            <DataTable
                mode="sales"
                getOptions={{customer_id:customerData.id}}
                TableName={`Sales , customer_id:${customerData.id}`}
                refreshParent2={() => {
                    setReload(prev => !prev);
                }}                      
            />
            </div>       
        }
    </div>
);
}