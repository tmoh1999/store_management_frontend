import { useLocation } from "react-router-dom";
import { apiGet, searchProduct ,test} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";

export default function ProductProfile(){
const {state}=useLocation();
const [productData,setProductData]=useState({
    "id":null,
    "name":"",
    "barcode":"",
    "quantity":0.0
});
useEffect(()=>{
    async function loadData(){
        const result= await searchProduct("product_id",state.profile_id);
        setProductData(prev => ({
            ...prev,
            id:result.product_id,
            name:result.product_name,
            barcode:result.product_barcode,
            quantity:result.product_quantity
        }));
    }
    loadData();

},[state]);
return (
    <div className="flex h-screen flex-col bg-gray-100">

        <div className="flex flex-col w-fit rounded-lg shadow-lg bg-white p-2 mt-8 ml-8">
        <div className="flex justify-start mb-3">
            <h1 className="font-semibold text-2xl">Product Data</h1>
        </div>
        <p className="text-lg"><span className="text-xl underline  mr-4">Name:</span>{productData.name}</p>
        <p className="text-lg"><span className="text-xl underline mr-4">Barcode:</span>{productData.barcode}</p>
        <p className="text-lg"><span className="text-xl underline mr-4">Quantity:</span>{productData.quantity}</p>
        
        
            
        </div>
        {productData.id &&
            <>
            <DataTable
                mode="purchase_items"
                getOptions={{product_id:productData.id}}
                TableName={`Purchase History , Product_id:${productData.id}`}
            />
            <DataTable
                mode="sale_items"
                getOptions={{product_id:productData.id}}
                TableName={`Sale History , Product_id:${productData.id}`}
            />
            </>       
        }
    </div>
);
}