import { Link ,useNavigate,useLocation} from "react-router-dom";
import { useEffect ,useState} from "react";
import {removeRow ,saveTransactionRow} from "../api";
import Table from "../Table";
import DataTable from "../DataTable";

export default function Transactions() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-fit p-2 mt-3">
        <div className="flex justify-end">
          <Link
                  to="/addtransaction"
                  className="p-2 rounded-xl shadow-lg text-white bg-blue-600 text-center text-2xl font-medium hover:bg-green-700"
                >
                Add Transaction
            </Link>          
        </div> 
        <DataTable
            mode="transactions"
            getOptions={{}}
            TableName={`Transactions`}
            Edit={true}
        />  
      </div>
    </div>
  );
}