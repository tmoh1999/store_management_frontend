import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {removeProduct} from "./api"
import ConfirmMessage from "./confirmMessage"
export default function Table({ data, columns ,rootpath,refreshParent}) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate=useNavigate();
  const [showConfirm,setShowConfirm]=useState(false);
  const [confimed,setConfirmed]=useState(false);
  const [deletePath,setDeletePath]=useState("");
  // Search filter
  const filteredData = data.filter((row) =>
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
  useEffect(() => {
  	console.log(1999);
      if (deletePath){
            const result = removeProduct(deletePath);
            console.log(result.status);
            setDeletePath("");
            refreshParent();
      }
  },[confimed]);
const handleClick = async (e,row) => {
	console.log(row)
	const path=rootpath+"/"+e.currentTarget.id+"/"+e.currentTarget.dataset.key
	let destpath="/products"
	if ( rootpath.includes("/api/products")){
		if (e.currentTarget.dataset.key=="update"){
             destpath="/updateproduct"
             navigate(destpath,{
						state:{
				            path:path,
				            row:row,
				         }
             });
       }else  if (e.currentTarget.dataset.key=="remove"){
             try {
             	setShowConfirm(true);
                 setDeletePath(path);
              } catch (err) {
                    console.log(err.message);
               }
       } else if (e.currentTarget.dataset.key=="view"){
            setShowConfirm(true);
                        }
    }
	
    console.log(path);
  };
  return (
    <div className=" w-auto p-3">
    {showConfirm &&
     <ConfirmMessage message="Confirm Delete?" onConfirm={() => {setConfirmed(true);setShowConfirm(false);}} onClose={() => {setShowConfirm(false);}}/>
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
            <tr key={i} className="odd:bg-white even:bg-gray-100">
              {columns.map((col) => (
                <td key={col.accessor} className="p-3 border">
                  {row[col.accessor]}
                </td>
              ))}
              <td  className="p-2 border">
                  <button onClick={(e) => handleClick(e,row)} id={row.id} data-key="view" className="p-1 font-semibold rounded-xl shadow-lg  bg-green-400 hover:bg-green-500">View</button>
                </td>
                <td  className="p-2 border">
                  <button onClick={(e) => handleClick(e,row)} id={row.id} data-key="update" className="p-1 font-semibold rounded-xl shadow-lg  bg-orange-400 hover:bg-orange-500">Edit</button>
                </td>
                <td  className="p-2 border">
                  <button onClick={(e) => handleClick(e,row)} id={row.id} data-key="remove" className="p-1 font-semibold rounded-xl shadow-lg  bg-red-400 hover:bg-red-500">Remove</button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}