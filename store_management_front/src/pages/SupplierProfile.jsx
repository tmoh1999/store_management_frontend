import { useLocation } from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";
import NoDataFound from "../components/NoDataFound";

export default function SupplierProfile(){
const {state}=useLocation();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [supplierData,setSupplierData]=useState({
    "id":null,
    "name":"",
    "email":"",
    "phone":"",
});
useEffect(()=>{
    setError("");
    setLoading(true);
    apiGet("/api/suppliers/search",{"supplier_id":state.id})
    .then(result => {
        if(!result?.success){
            setError(result.message);
            return;
        }
        setSupplierData(prev => ({
            ...prev,
            id:result.supplier_id,
            name:result.name,
            email:result.email,
            phone:result.phone,
        }));
    }).catch(err => {
        setError(err.message);
    }).finally(()=>{
        setLoading(false);
    });

},[state]);
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
                        TableName={`Purchases from ${supplierData.name}`}                
                    />
                    </div>       
                }
            </>
        )
        }            
    </div>
);
}