
import Table from "../Table";
import { useEffect ,useState} from "react";
import { Link ,useLocation} from "react-router-dom";
import {login,getProducts} from "../api";
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
   <div className="p-1">
   <h1 className="text-2xl font-bold " >Products</h1>
   
    <Table data={products.data} columns={products.columns}  rootpath="/api/products" 
    refreshParent={() =>{
    	setReload(prev => !prev);
    }}/>
    
    </div>
  );
}