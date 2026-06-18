
import { Link} from "react-router-dom";
import DataTable from "../DataTable";


export default function Refunds() {
  return (
    <div className="flex justify-center min-w-fit p-3">
      <div className="sm:w-3/4 min-w-[700px]">
         
        <div className="flex justify-end mb-3">
          <Link
                  to="/addrefund"
                  className="p-2 rounded-xl shadow-lg text-white bg-green-600 text-center text-2xl font-medium hover:bg-green-700"
                >
                Add Refund
            </Link>
        </div>
          <DataTable mode="refunds" TableName="Refunds" Edit={true}/> 
      </div>
    </div>
  );
}