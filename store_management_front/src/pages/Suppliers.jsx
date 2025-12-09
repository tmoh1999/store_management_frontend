import { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import Table from "../Table";
import { getSuppliers, removeRow, saveSuppliersRow } from "../api";
import DataTable from "../DataTable";
export default function Suppliers(){

    return(
        <div className=" flex justify-center">
            <div className=" p-2 w-fit mt-3">
                <div className="flex justify-end">
                <Link
                    to="/addsupplier"
                    className="p-2  rounded-xl shadow-lg text-white bg-green-600 text-center text-2xl font-medium hover:bg-green-700"
                    >
                    Add Supplier
                </Link>
                </div>
                <DataTable
                    mode="suppliers" TableName="Suppliers"
                />
            </div>
        </div>
    );
}