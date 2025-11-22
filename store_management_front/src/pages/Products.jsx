
import Table from "../Table";
import { useEffect ,useState} from "react";
import { Link ,useLocation} from "react-router-dom";
import {login,getProducts,downloadFile} from "../api";
// you will create these pages

export default function ProductList() {
  const [reload,setReload]=useState(false);
  const [products,setProducts]=useState({
    columns: [],
    data: []
  });
  
  
	
  
  const columns = [
    { label: "ID", accessor: "id" },
    { label: "Barcode", accessor: "barcode" },
    { label: "Name", accessor: "name" },
    { label: "Price", accessor: "price" },
    { label: "Quantity", accessor: "quantity" },
  ];

  
  useEffect(() => {
    getProducts()
   .then(result => {
        console.log(result.results);
        
        setProducts(prev => ({
  ...prev,
  columns: [
    { label: "ID", accessor: "id" },
    { label: "Barcode", accessor: "barcode" },
    { label: "Name", accessor: "name" },
    { label: "Price", accessor: "price" },
    { label: "Quantity", accessor: "quantity" },
  ],
  data: result.results
}));
    });
}, [reload]);


  return (
   <div className="w-auto  p-1">
   
   
     
   <h1 className="text-2xl font-bold " >Products</h1>
   <div className="flex justify-end ">
   <Link
          to="/addproduct"
          className="p-2 mr-8 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
        >
        Add Product
    </Link>
    
   <button
          className="p-2 mr-8 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
          onClick={(e) => downloadFile('/api/products/export',"products.xlsx")}
        >
        Export to excel file
    </button>
    <button
          className="p-2 mr-8 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
          onClick={(e) => downloadFile('/api/products/products.pdf/0/',"products.pdf")}
        >
        Export to pdf fil
     </button>
    </div>
    <Table data={products.data} columns={products.columns}  rootpath="/api/products" 
    refreshParent={() =>{
    	setReload(prev => !prev);
    }}/>
    
    </div>
  );
}