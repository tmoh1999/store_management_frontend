import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import TableCell from "./TableCell"
import ConfirmMessage from "./confirmMessage"
export default function Table({ data, columns ,rootpath,refreshParent,removeRow,saveRow}) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [tableData, setTableData] = useState(data);
  const navigate=useNavigate();
  const [showConfirm,setShowConfirm]=useState(false);
  const [confimed,setConfirmed]=useState(false);
  const [editingRow,setEditingRow]=useState(null);
  const [deletePath,setDeletePath]=useState("");
  useEffect(()=>{
  setTableData(data);
},[data]);
  // Search filter
  const filteredData = tableData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Sort function
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const valA = a[sortColumn];
    const valB = b[sortColumn];

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Sort handler
  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortOrder("asc");
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!deletePath) return;
    const result = await removeRow(deletePath);
    console.log(result.status);
    setDeletePath("");
    setConfirmed(false);
    refreshParent();
    setShowConfirm(false);
};

const handleClick = async (e,row) => {
	console.log(row)
	const path=rootpath+"/"+e.currentTarget.id+"/"+e.currentTarget.dataset.key
	let destpath="/products"
	
		if (e.currentTarget.dataset.key=="update"){
			setEditingRow(row.id);
			if ( rootpath.includes("/api/prodcts")){
	             destpath="/updateproduct"
	             navigate(destpath,{
							state:{
					            path:path,
					            row:row,
					         }
	             });
             }
       }else  if (e.currentTarget.dataset.key=="remove"){
             
             	
             	setShowConfirm(true);
                 
                 setDeletePath(path);
                 console.log(confimed);
              
       } else if (e.currentTarget.dataset.key=="view"){
            setShowConfirm(true);
       } else if (e.currentTarget.dataset.key=="save"){
       	 
            setEditingRow(null);
            if (saveRow){
              try {
                  const result = await saveRow(row);
                  console.log(result);
                } catch (err) {
                  console.log(err.message);
                }
            }
       } 
    
	
    console.log(path);
  };
  const handleChange = (e, row) => {
  const { name, value } = e.target;

  // update tableData immutably
  setTableData(prev =>
    prev.map(r =>
      r.id === row.id ? { ...r, [name]: value } : r
    )
  );
};
  
  return (
    <div className=" w-auto p-3">
    {showConfirm &&
     <ConfirmMessage message="Confirm Delete?" onConfirm={handleConfirmDelete} onClose={() => {setShowConfirm(false);}}/>
     }
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 rounded mb-3 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <table className="border-collapse shadow-md">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="p-3 cursor-pointer border"
                onClick={() => handleSort(col.accessor)}
              >
                {col.label}
                {sortColumn === col.accessor &&
                  (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, i) => (
            <tr key={row.id} className="odd:bg-white even:bg-gray-100">
              {columns.map((col) => (
                <TableCell key={`${row.id}-${col.accessor}`}  Editable={editingRow === row.id && col.edit} val={row[col.accessor]} type="text" name={col.accessor} onChanged={(e) => handleChange(e,row)}/>
              ))}
              {editingRow === row.id ? ( 
              
                
                <td  key={`${row.id}-save`} className="p-2 border">
                  <button onClick={(e) => handleClick(e,row)} id={row.id} data-key="save" className="p-1 font-semibold rounded-xl shadow-lg  bg-blue-400 hover:bg-blue-500">Save</button>
                </td>
                
                
                ) : (
              <>
              <td  key={`${row.id}-view`} className="p-2 border">
                  <button onClick={(e) => handleClick(e,row)} id={row.id} data-key="view" className="p-1 font-semibold rounded-xl shadow-lg  bg-green-400 hover:bg-green-500">View</button>
                </td>
                
                <td  key={`${row.id}-edit`} className="p-2 border">
                  <button onClick={(e) => handleClick(e,row)} id={row.id} data-key="update" className="p-1 font-semibold rounded-xl shadow-lg  bg-orange-400 hover:bg-orange-500">Edit</button>
                </td>
                
                <td key={`${row.id}-remove`} className="p-2 border">
                  <button onClick={(e) => handleClick(e,row)} id={row.id} data-key="remove" className="p-1 font-semibold rounded-xl shadow-lg  bg-red-400 hover:bg-red-500">Remove</button>
                </td>
                </>
                )}
                
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}