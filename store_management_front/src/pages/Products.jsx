
import Table from "../Table";
import { useEffect ,useState} from "react";
import { Link ,useLocation} from "react-router-dom";
import {login,getProducts,downloadFile,removeProduct,saveProductRow} from "../api";
import UploadFile from "../UploadFile"
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
    { label: "ID", accessor: "id" ,edit:false },
    { label: "Barcode", accessor: "barcode" ,edit:true },
    { label: "Name", accessor: "name" ,edit:true },
    { label: "Price", accessor: "price" ,edit:true },
    { label: "Quantity", accessor: "quantity" ,edit:false },
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
    <div className="flex justify-end ">
    <UploadFile apiPath="/api/products/import" fileType=".xlsx"/>
    </div>
    <Table saveRow={saveProductRow}   removeRow={removeProduct} data={products.data} columns={products.columns}  rootpath="/api/products" 
    refreshParent={() =>{
    	setReload(prev => !prev);
    }}/>
    
    </div>
  );
}