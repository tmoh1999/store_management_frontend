import { useEffect, useState } from "react";
import Table from "../Table";
import DataTable from "../DataTable";

export default function StartPurchase(){
    const [supplierSelected,setSupplierSelected]=useState(null);
    const [openSelectMenu,setOpenSelectMenu]=useState(false);
    const handleSubmit= () => {

    };
    useEffect(()=>{
        if(supplierSelected){
            console.log(supplierSelected);
            setOpenSelectMenu(false);
        }
    },[supplierSelected]);


    return(
        <div>
            {openSelectMenu ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="h-screen overflow-y-auto p-2 bg-white shadow-lg rounded-lg">
                        <DataTable
                            mode="suppliers"
                            table_mode="select"
                            TableName="Select Supplier"
                            setSelectedRow={setSupplierSelected}
                        />
                    </div>    
                </div>
            ):(
            <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
                <form onSubmit={handleSubmit} className="bg-white p-3 gap-4 rounded-xl shadow-lg w-fit">
                    <div className="mb-3">
                        <div className="mb-2">
                            <label htmlFor="supplier" className="text-sm text-gray-700 font-semibold">Supplier:</label>
                            <button onClick={() => {
                                setOpenSelectMenu(true);
                                }} 
                                className="p-1 ml-3 rounded-xl shadow-lg bg-blue-500 hover:bg-blue-600 font-medium text-white">
                                Choose Supplier
                            </button>
                        </div>      
                        <h2  className="w-75 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">{supplierSelected? supplierSelected.name:"supplier not selected"}</h2>
                    </div>
                    <div className="mb-1">
                        <label htmlFor="description" className="block text-sm text-gray-700 font-semibold">Description</label>
                        <input type="text" id="description" className="w-75 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
                    </div>
                </form>
            </div>
            )
            }
        </div>
    );
}