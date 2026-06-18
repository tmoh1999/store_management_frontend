import {Link} from "react-router-dom"
import DataTable from "../DataTable";
export default function Customers(){

    return(
        <div className=" flex justify-center min-w-fit">
            <div className=" p-2  sm:w-3/4 min-w-[500px] mt-3">
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