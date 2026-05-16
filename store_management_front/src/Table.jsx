import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import TableCell from "./TableCell"
import ConfirmMessage from "./confirmMessage"
import { downloadFile } from "./api";
import Pagination from "./components/Pagination";
import NoDataFound from "./components/NoDataFound";
export default function Table({ mode="view",data=[], columns=[] ,profilePath="/",profileKeys=[],
  SelectName="Select",
  rootpath,refreshParent,
  setSelectedRow,removeRow,saveRow,addRow,
  TableName,options={},setPage,pages=1,page=1,
  search, setSearch,
  sortColumn, setSortColumn,
  sortOrder, setSortOrder
  }) {
  const navigate=useNavigate();
  const [showConfirm,setShowConfirm]=useState(false);
  const [confirmed,setConfirmed]=useState(false);
  const [editingRow,setEditingRow]=useState(null);
  const [deletePath,setDeletePath]=useState("");
  const [pendingEdits, setPendingEdits] = useState({});
  const [newRows, setNewRows] = useState([]);  
  const getRowValue = (row, accessor) => {
      return pendingEdits[row.id]?.[accessor] ?? row[accessor];
  };

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
const handleChange = (e, row) => {
    const { name, value } = e.target;
    setPendingEdits(prev => ({
        ...prev,
        [row.id]: { ...prev[row.id], [name]: value }
    }));
};

const handleClick = async (e,row) => {
	console.log(row)
	const path=rootpath+"/"+e.currentTarget.id+"/"+e.currentTarget.dataset.key
	let destpath="/products"
	
		if (e.currentTarget.dataset.key=="update"){
			setEditingRow(row.id);
       }else  if (e.currentTarget.dataset.key=="remove"){
             
             	if(removeRow){
             	   setShowConfirm(true);
                 setDeletePath(path);
                 console.log(confirmed);
              }
       } else if (e.currentTarget.dataset.key=="view"){
          let state={}
          for(let col of profileKeys){
            state[col]=row[col];
          }
          if(profilePath){           
            navigate(profilePath,{
              state:state
            });
         }
       } else if (e.currentTarget.dataset.key=="save"){
       	 
          setEditingRow(null);
          const editedRow = { ...row, ...pendingEdits[row.id] };
          setPendingEdits(prev => {
              const copy = { ...prev };
              delete copy[row.id];
              return copy;
          });          
          if(!row.id) {
            if(addRow){
              try {
                const result = await addRow(editedRow);
                setNewRows(prev => prev.filter(r => r.id !== row.id));
                refreshParent();
              } catch (err) {
                console.log(err.message);
              }
            }
          }else if (saveRow){
            try {
                const result = await saveRow(editedRow);
                refreshParent();
              } catch (err) {
                console.log(err.message);
              }
          }
       } else if(e.currentTarget.dataset.key=="select"){
        if(setSelectedRow){
          setSelectedRow(row);
        }
       }
    
	
    console.log(path);
  };

const getPages = () => {
  const range = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
};
const addEmptyRow = () => {
    if (addRow) {
        const emptyRow = { id: `new-${Date.now()}` };
        columns.forEach(col => { emptyRow[col.accessor] = ""; });
        setNewRows(prev => [...prev, emptyRow]);
        setEditingRow(emptyRow.id);
    }
};
  return (
    <div className=" flex flex-col justify-center items-center w-auto p-3">
      {showConfirm &&
      <ConfirmMessage message="Confirm Delete?" onConfirm={handleConfirmDelete} onClose={() => {setShowConfirm(false);}}/>
      }
      <div className="w-fit min-w-full">
        <div className="flex flex-col">
            <div className="flex w-full justify-end mb-2 ml-5">
              <button
                      className="p-2 mr-5 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
                      onClick={(e) => downloadFile(`${rootpath}/export/excel`,"report.xlsx",{...options,search:search,sort_column:sortColumn,sort_direction:sortOrder})}
                    >
                    Export Excel
                </button>
                <button
                      className="p-2 mr-2 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
                      onClick={(e) => downloadFile(`${rootpath}/export/pdf`,"report.pdf",{...options,search:search,sort_column:sortColumn,sort_direction:sortOrder})}
                    >
                    Export Pdf
                </button>          
            </div>
            <div className="flex justify-start mb-2">
              {/*Table Name*/}
              <h1 className="text-4xl font-bold " >{TableName}</h1>
            </div>            
        </div>
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded mb-3 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {data.length === 0 ? (
          <NoDataFound message="No records found." />
        ) : (
          <>
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
              {[...data, ...newRows].map((row, i) => (
                <tr key={row.id} className="odd:bg-white even:bg-gray-100">
                  {columns.map((col) => (
                    <TableCell key={`${row.id}-${col.accessor}`}  Editable={editingRow === row.id && col.edit} val={getRowValue(row, col.accessor)} type="text" name={col.accessor} onChanged={(e) => handleChange(e,row)}/>
                  ))}
                  {mode=="view" ? (
                    editingRow === row.id ? 
                    ( 
                        <td  key={`${row.id}-save`} className="p-2 border">
                          <button onClick={(e) => handleClick(e,row)} id={row.id} data-key="save" className="p-1 font-semibold rounded-xl shadow-lg  bg-blue-400 hover:bg-blue-500">Save</button>
                        </td>     
                    )
                    :
                    (
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
                    )
                  ):(
                        <td  key={`${row.id}-select`} className="p-2 border">
                          <button onClick={(e) => handleClick(e,row)} id={row.id} data-key="select" className="p-1 font-semibold rounded-xl shadow-lg  bg-blue-400 hover:bg-blue-500">{SelectName}</button>
                        </td>        
                  )
                  }
                    
                </tr>
              ))}
            </tbody>
          </table>
          {addRow && mode=="view" && (
            <div  className="p-1 border">
              <button  onClick={addEmptyRow} className="py-1 px-2 font-semibold rounded-xl shadow-lg  bg-blue-400 hover:bg-blue-500">➕ add line</button>
            </div>
          )}        
          <Pagination page={page} setPage={setPage} pages={pages}/>
          </>
        )}
      </div>

    </div>
  );
}