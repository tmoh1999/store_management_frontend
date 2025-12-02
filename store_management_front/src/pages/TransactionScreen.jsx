import {addSaleItem,getSaleItems,updateSaleItem,removeRow,confirmSale,addPurchaseItem,getPurchaseItems,updatePurchaseItem,confirmPurchase} from "../api"
import Table from "../Table";
import { useEffect ,useState} from "react";
import TableCell from "../TableCell"
export default function TransactionScreen({mode,transaction_id,setTransactionId,setTransactionStatus}){
const tablename= mode=="sale" ? "Sale N°"+transaction_id.toString()+" Items" : "Purchase N°"+transaction_id.toString()+" Items"

const [formData, setFormData] = mode=="sale" ? 
useState({
    description: "",
    quantity: 1,
    price:0.0,
  })
  :
useState({
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
      { label: "ID", accessor: "id" ,edit:false},
      { label: "Barcode", accessor: "barcode" ,edit:false },
      { label: "Name", accessor: "name" ,edit:false },
      { label: "Unit Price", accessor: "price" ,edit:true },
      { label: "Quantity", accessor: "quantity" ,edit:true },
      { label: "Description", accessor: "description" ,edit:true },
    ],
  purchase:  [
      { label: "ID", accessor: "id" ,edit:false},
      { label: "Barcode", accessor: "barcode" ,edit:false },
      { label: "Name", accessor: "name" ,edit:false },
      { label: "Purchase Price", accessor: "price" ,edit:true },
      { label: "Quantity", accessor: "quantity" ,edit:true },
    ],    
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
       const result=await api.addItem(formData,transaction_id);
       console.log(result.results);
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
       setTransactionStatus(result.sale_status);
       setTransactionId(0);
       
   }catch(err){
       console.log(err);
   }
};

useEffect(() => {
    api.getItems(transaction_id)
   .then(result => {
        console.log(result.results);
        
        setItems(prev => ({
  ...prev,
  columns: columns,
  data: result.results
}));
    });
}, [reload]);
return (
<div className="mt-2 flex flex-col items-center justify-center ">
<div className="w-fit">

<table className="w-auto shadow-md">
<thead >
  <tr className="bg-gray-200">
                    <th className="p-3 cursor-pointer border">Name</th>
                    <th className="p-3 cursor-pointer border">Barcode</th>
                    <th className="p-3 cursor-pointer border">Description</th>
                    <th className="p-3 cursor-pointer border">Price</th>
                    <th className="p-3 cursor-pointer border">Quantity</th>
  </tr>
</thead>

<tbody>
     <tr className="bg-gray-100">
                    <TableCell Editable={false} val=""/>
                    <TableCell Editable={false} val=""/>
                    {mode=="sale" &&
                      <TableCell Editable={true} val={formData.description} type="text" name="description" onChanged={handleChange}/>
                    }    
                    <TableCell Editable={true} val={formData.price} type="number" name="price" onChanged={handleChange}/>
                    <TableCell Editable={true} val={formData.quantity} type="number" name="quantity" onChanged={handleChange}/>
    </tr>
</tbody>
</table>

<div className=" mt-2 flex justify-end ">
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
<Table TableName={tablename} removeRow={api.remove} saveRow={api.updateItem} data={items.data} columns={items.columns}  rootpath="/api/sales/items" 
    refreshParent={() =>{
    	setReload(prev => !prev);
    }}/>
    </div>
</div>

)
}