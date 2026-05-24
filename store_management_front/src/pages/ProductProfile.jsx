import { useLocation , Link} from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import DataTable from "../DataTable";
import NoDataFound from "../components/NoDataFound";
export default function ProductProfile(){
const {state}=useLocation();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [productData,setProductData]=useState({
    "id":null,
    "name":"",
    "barcode":"",
    "quantity":0.0,
    "price":0.0,
    "min_stock_level":10.0,
});
useEffect(()=>{

    setError("");
    setLoading(true);
    apiGet("/api/products/search",{"product_id":state.id})
    .then(result => {
        if(!result?.success){
            setError(result.message);
            return;
        }
        setProductData(prev => ({
            ...prev,
            id:result.product_id,
            name:result.product_name,
            barcode:result.product_barcode,
            quantity:result.product_quantity,
            price:result.product_price,
            min_stock_level:result.product_min_stock_level
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
                    <h1 className="font-semibold text-2xl">Product Data:</h1>
                    <Link
                        to="/updateproduct"
                        state={productData}
                        className="ml-5 px-2 py-0.5 rounded-xl shadow-lg text-white bg-blue-600 text-center text-2xl font-medium hover:bg-green-700"
                        >
                        Edit
                    </Link>                    
                </div>
                <p className="text-lg"><span className="text-xl underline  mr-4">Name:</span>{productData.name}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Barcode:</span>{productData.barcode}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Price:</span>{productData.price}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Quantity:</span>{productData.quantity}</p>
                <p className="text-lg"><span className="text-xl underline mr-4">Min Stock:</span>{productData.min_stock_level}</p>
            </div>
        </div>
        {productData.id &&
            <div className="flex flex-col items-start">
            <DataTable
                mode="purchase_items"
                getOptions={{product_id:productData.id}}
                TableName={`${productData.name}'s Purchases`}  
            />
            <DataTable
                mode="sale_items"
                getOptions={{product_id:productData.id}}
                TableName={`${productData.name}'s Sales`}  
            />
            </div>       
        }
        </>
        )}
    </div>
);
}