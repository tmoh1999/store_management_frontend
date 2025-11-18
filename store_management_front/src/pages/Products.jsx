
import Table from "../Table";
import { useEffect ,useState} from "react";
import { Link ,useNavigate,useLocation} from "react-router-dom";
import {login,getProducts} from "../api";
// you will create these pages

export default function ProductList() {

  const [products,setProducts]=useState({
    columns: [],
    data: []
  });
  const navigate = useNavigate();
  const location = useLocation();
	const user=location.state;
	
useEffect(() => {
	
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to login page
      navigate("/login");
    }
  }, [navigate]);
  
  

  const tk=localStorage.getItem("token");
  console.log(tk);
  
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
}, []);
  return (
   <div className="p-1">
   <h1 className="text-2xl font-bold " >Products</h1>
   
    <Table data={products.data} columns={products.columns}/>
    
    </div>
  );
}