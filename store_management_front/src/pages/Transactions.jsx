import { Link} from "react-router-dom";
import DataTable from "../DataTable";

export default function Transactions() {
  return (
    <div className="flex justify-center min-w-fit">
      <div className="flex flex-col sm:w-3/4 min-w-[700px]  p-2 mt-3">
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