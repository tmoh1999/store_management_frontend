import { useEffect, useState } from "react";
import Table from "../Table";
import DataTable from "../DataTable";
import { addPurchase } from "../api";

export default function StartPurchase({setPurchaseID,setOpenStartPurchase}){
    const [supplierSelected,setSupplierSelected]=useState(null);
    const [openSelectMenu,setOpenSelectMenu]=useState(false);
    const [formData,setFormData]=useState({
        supplier_id:null,
        description:""
    });
    const handleSubmit= async (e) => {
        e.preventDefault();
        console.log(formData);
        if (formData.supplier_id){
            try{
                console.log(formData);
                const result= await addPurchase(formData);
                console.log(result);
                if (result.success){
                   setPurchaseID(result.id)
                   setOpenStartPurchase(false)
                }
            }catch(error){
                console.log(error.message)
            }
        }else{

        }
    };
    const handleChange= (e) => {
        const {name,value}=e.target;
        setFormData(prev => ({
            ...prev,
            [name]:value
        }));
    };
    useEffect(()=>{
        if(supplierSelected){
            console.log(supplierSelected);
            setOpenSelectMenu(false);
            setFormData(prev => ({
                ...prev,
                ["supplier_id"]:supplierSelected.id
            }));
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
                <form onSubmit={handleSubmit} className="bg-white p-5 gap-4 rounded-xl shadow-lg w-fit">
                    <div className="mb-6">
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
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm text-gray-700 font-semibold">Description</label>
                        <input onChange={handleChange} value={formData.description} type="text" name="description" id="description" className="w-75 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
                    </div>
                    <div className="flex w-full justify-center mb-1">
                        <button type="submit" className="p-1 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg">Start Purchase</button>
                    </div>
                </form>
            </div>
            )
            }
        </div>
    );
}