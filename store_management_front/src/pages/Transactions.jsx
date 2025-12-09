import { Link ,useNavigate,useLocation} from "react-router-dom";
import { useEffect ,useState} from "react";
import { getTransactions, removeRow ,saveTransactionRow} from "../api";
import Table from "../Table";
import DataTable from "../DataTable";
export default function Transactions() {
  return (
    <div className="flex flex-col ">
      <DataTable
          mode="transactions"
          getOptions={{}}
          TableName={`Transactions`}
      />  
    </div>
  );
}