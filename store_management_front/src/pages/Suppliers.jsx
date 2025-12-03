import { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import Table from "../Table";
import { getSuppliers, removeRow, saveSuppliersRow } from "../api";
export default function Suppliers(){
    const [suppliers,setSuppliers]=useState({
        columns:[],
        data:[]
    });
    const [reload,setReload]=useState(false);

    const   columns= [
        { label: "ID", accessor: "id" ,edit:false },
        { label: "Name", accessor: "name" ,edit:true },
        { label: "Email", accessor: "email" ,edit:true },
        { label: "Phone", accessor: "phone" ,edit:true },
    ]

    useEffect(() =>{
        getSuppliers()
        .then(result => {
            console.log(result.results);
            setSuppliers(prev => ({
                ...prev,
                columns:columns,
                data:result.results,
            }));
        });
    },[reload]);

    return(
        <div className=" p-6">
            <Link
                to="/addsupplier"
                className="p-2 mr-8 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
                >
                Add Supplier
            </Link>

            <Table data={suppliers.data} columns={suppliers.columns} rootpath="/api/suppliers" TableName="Suppliers"
            removeRow={removeRow} saveRow={saveSuppliersRow}
            refreshParent={() => {
                setReload(prev => !prev);
            }}
            />
        </div>
    );
}