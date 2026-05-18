import { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import Table from "../Table";
import { removeRow, saveCustomersRow } from "../api";
import DataTable from "../DataTable";
export default function Customers(){

    return(
        <div className=" flex justify-center">
            <div className=" p-2 w-fit mt-3">
                <div className="flex justify-end">
                <Link
                    to="/addcustomer"
                    className="p-2  rounded-xl shadow-lg text-white bg-green-600 text-center text-2xl font-medium hover:bg-green-700"
                    >
                    Add Customer
                </Link>
                </div>
                <DataTable
                    mode="customers" TableName="Customers" Edit={true}
                />
            </div>
        </div>
    );
}