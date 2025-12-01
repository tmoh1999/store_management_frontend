import { Link ,useNavigate,useLocation} from "react-router-dom";
import { useEffect ,useState} from "react";
import { getTransactions, removeRow ,saveTransactionRow} from "../api";
import Table from "../Table";
export default function Transactions() {

  const [transactions,SetTransactions]=useState({
    columns:[],
    data:[]
  });
  const [reload,setReload]=useState(false);

  useEffect(() => {
    getTransactions()
    .then(result => {
      console.log(result.results);
      SetTransactions(prev => ({
        ...prev,
        columns:[
          { label: "ID", accessor: "id" ,edit:false },
          { label: "Date", accessor: "date" ,edit:false },
          { label: "Amount", accessor: "amount" ,edit:false },
          { label: "Type", accessor: "type" ,edit:false },
          { label: "Note", accessor: "note" ,edit:true },
        ],
        data:result.results,
      }));
      
    });
  } ,[reload]);
  return (
    <div className="flex flex-col ">
      <h1 className="p-1 text-3xl text-center font-bold ">Transactions</h1>
      <Table data={transactions.data} columns={transactions.columns} rootpath="/api/transactions"
        removeRow={removeRow} saveRow={saveTransactionRow}
        refreshParent={() => {
          setReload(prev => !prev);
        }}
      />
    </div>
  );
}