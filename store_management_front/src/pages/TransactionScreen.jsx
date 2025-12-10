import {addSaleItem,getSaleItems,updateSaleItem,removeRow,confirmSale,addPurchaseItem,getPurchaseItems,updatePurchaseItem,confirmPurchase, searchProduct} from "../api"
import Table from "../Table";
import { useEffect ,useState} from "react";
import TableCell from "../TableCell"
import DataTable from "../DataTable";
import BarcodeScanner from "../BarcodeScanner";
export default function TransactionScreen({mode,transaction_id,setTransactionId}){
const tablename= mode=="sale" ? "Sale N°"+transaction_id.toString()+" Items" : "Purchase N°"+transaction_id.toString()+" Items"
const [product,setProduct]=useState(null);
const [openSelectMenu,setOpenSelectMenu]=useState(false);
const [showScanner, setShowScanner] = useState(false);
const [total,setTotal]=useState(0);
const [formData, setFormData] = mode=="sale" ? 
useState({
    product_id:null,
    barcode:"",
    name:"",
    description: "",
    quantity: 1,
    price:0.0,
  })
  :
useState({
    product_id:null,
    barcode:"",
    name:"",  
    quantity: 1,
    price:0.0,
  })

  ;
const [reload,setReload]=useState(false);
const [items,setItems]=useState({
  columns: [],
  data: []
});
// 1️⃣ API MAPPING BASED ON MODE
const api = {
  sale: {
    addItem: addSaleItem,
    getItems: getSaleItems,
    updateItem: updateSaleItem,
    remove: removeRow,
    confirm: confirmSale
  },
  purchase: {
    addItem: addPurchaseItem,
    getItems: getPurchaseItems,
    updateItem: updatePurchaseItem,
    remove: removeRow,
    confirm: confirmPurchase
  }
}[mode];
const columns= {
  sale:  [
      { label: "ID", accessor: "id",db_name:"item_id" ,edit:false},
      { label: "Barcode", accessor: "barcode",db_name:"barcode" ,edit:false },
      { label: "Name", accessor: "name",db_name:"name" ,edit:false },
      { label: "Unit Price", accessor: "price",db_name:"unit_price" ,edit:true },
      { label: "Quantity", accessor: "quantity",db_name:"quantity_float" ,edit:true },
      { label: "Description", accessor: "description",db_name:"description" ,edit:true },
    ],
  purchase:  [
      { label: "ID", accessor: "id",db_name:"purchase_item_id" ,edit:false},
      { label: "Barcode", accessor: "barcode",db_name:"barcode" ,edit:false },
      { label: "Name", accessor: "name",db_name:"name" ,edit:false },
      { label: "Purchase Price", accessor: "price",db_name:"purchase_price" ,edit:true },
      { label: "Quantity", accessor: "quantity",db_name:"quantity_float" ,edit:true },
    ],    
  }[mode];
const rootPath={
  sale:"/api/sales/items",
  purchase:"/api/purchases/items",
}[mode];
const handleChange = (e) => {
	console.log(e.target.value);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
const handleClick = async () => {
   try {
   	console.log(formData);
       const result=await api.addItem(formData,transaction_id,formData.product_id);
       console.log(result.success);
       setReload(prev => !prev);
   }catch(err){
       console.log(err);
   }
};

const CancelClick = async () => {
   try {
   	const path=mode=="sale" ? "/api/sales/"+transaction_id+"/remove" : "/api/purchases/"+transaction_id+"/remove";
       const result=await api.remove(path);
       console.log(result.results);
       setTransactionId(0);
       
   }catch(err){
       console.log(err);
   }
};

const ConfirmClick = async () => {
   try {
   	
       const result=await api.confirm(transaction_id);
       console.log(result);
       setTransactionId(0);
       
   }catch(err){
       console.log(err);
   }
};

useEffect(() => {
    api.getItems(transaction_id)
   .then(result => {
        console.log(result.results);
        setTotal(result.total);
        setItems(prev => ({
  ...prev,
  columns: columns,
  data: result.results
}));
    });
}, [reload]);
const changeProduct=(row)=>{
console.log("ssss");
console.log(row);
console.log("ssss");
setFormData(prev => ({
...prev,
product_id:row.id,
name:row.name,
barcode:row.barcode,
price:row.price,
}));
setOpenSelectMenu(false);
};

const startScanning = () => {
  setShowScanner(true);
};
const onDetected = async (code)=> {
  console.log("code:::"+code);
  //setFormData({ ...formData, barcode: code });
  setShowScanner(false);
  try{
    const result=await searchProduct("barcode",code)
    if(result.success){
      console.log(result);
      setFormData(prev => ({
        ...prev,
        barcode:result.product_barcode,
        name:result.product_name,
        product_id:result.product_id,
      }));
    }
  }catch(error){
    console.log(error.message);
  }
};
return (
<div>
{openSelectMenu ? (
<div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
  <div className="h-screen overflow-y-auto shadow-lg rounded-lg bg-white p-2">
    <DataTable mode="products" table_mode="select" setSelectedRow={changeProduct} TableName="Select Product:"/>
  </div>  
</div>
):(
<>
<div className="mt-2 flex flex-col items-center justify-center ">
<div className="w-fit">
<h1 className="p-1 text-3xl text-center font-bold ">{mode=="purchase" ? "Purchase:": "Sale:"}{transaction_id}    Total:{total}</h1>
<table className="w-auto shadow-md">
<thead >
  <tr className="bg-gray-200">
                    <th></th>
                    <th className="p-3 cursor-pointer border">Name</th>
                    <th className="p-3 cursor-pointer border">Barcode</th>
                    {mode=="sale" &&
                      <th className="p-3 cursor-pointer border">Description</th>
                    }  
                    <th className="p-3 cursor-pointer border">Price</th>
                    <th className="p-3 cursor-pointer border">Quantity</th>
  </tr>
</thead>

<tbody>
     <tr className="bg-gray-100">
                    <td>            
                      <button onClick={startScanning} className="bg-green-600 text-white px-3 rounded-lg hover:bg-green-700 ml-2">
                      Scan
                      </button>
                    </td>
                    <TableCell Editable={false} val={formData.name}/>
                    <TableCell Editable={false} val={formData.barcode}/>
                    {mode=="sale" &&
                      <TableCell Editable={true} val={formData.description} type="text" name="description" onChanged={handleChange}/>
                    }    
                    <TableCell Editable={true} val={formData.price} type="number" name="price" onChanged={handleChange}/>
                    <TableCell Editable={true} val={formData.quantity} type="number" name="quantity" onChanged={handleChange}/>
    </tr>
</tbody>
</table>

<div className=" mt-2 flex justify-between ">
<button className="mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-green-500 hover:bg-green-600 "
onClick={()=>{setOpenSelectMenu(true);}}
>select product</button>
<button className="mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-blue-500 hover:bg-blue-600 "
onClick={handleClick}
>➕ Add Item</button>
</div>
</div>

<div className="mt-8">
<button className="mr-10 mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-green-500 hover:bg-green-600 "
onClick={ConfirmClick}
>💾 Confirm</button>

<button className="ml-10 mb-3 p-1 text-xl text-white font-medium shadow-lg rounded-xl bg-red-500 hover:bg-red-600 "
onClick={CancelClick}
>❌ Cancel</button>
</div>
<div className="mt-2">
<Table TableName={tablename} removeRow={api.remove} saveRow={api.updateItem} 
data={items.data} columns={items.columns}  rootpath={rootPath}
    refreshParent={() =>{
    	setReload(prev => !prev);
    }}/>
    </div>
</div>
</>
)
}
  {showScanner && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white p-4 rounded-lg shadow-lg w-80">
  <h1>Scanned Code: {formData.barcode}</h1>
  <BarcodeScanner onDetected={onDetected} />
      <button 
          className="mt-3 bg-red-500 text-white p-2 rounded-lg w-full hover:bg-red-600"
          onClick={() => setShowScanner(false)}
        >
          Close
      </button>
  </div>
  </div>
  )}
</div>
);
}