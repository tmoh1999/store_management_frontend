import { test,saveProductRow,getProducts,saveSuppliersRow,getSuppliers,updatePurchaseItem,getPurchaseItems,updateSaleItem,getSaleItems,removeRow, apiGet, savePurchaseRow, saveTransactionRow } from "./api";
import Table from "./Table";
import { useState,useEffect } from "react";
export default function DataTable({mode,table_mode="view",TableName="table",setSelectedRow,getOptions}){
    const [reload,setReload]=useState(false);
    const [rows,setRows]=useState({
      columns: [],
      data: []
    });
    
    // 1️⃣ API MAPPING BASED ON MODE
    const api = {
    products: {
        get: getProducts,
        update: saveProductRow,
        remove: removeRow,
        profilePath:"/product/profile",
        rootpath:"/api/products"
    },
    sales: {
        update: null,
        remove: removeRow,
        profilePath:"/product/profile",
        rootpath:"/api/sales"
    },               
    sale_items: {
        update: updateSaleItem,
        remove: removeRow,
        profilePath:"/sale/profile",
        rootpath:"/api/sales/items"
    },
    purchases: {
        update: savePurchaseRow,
        remove: removeRow,
        profilePath:"/purchase/profile",
        rootpath:"/api/purchases"
    },
    purchase_items: {
        update: updatePurchaseItem,
        remove: removeRow,
        profilePath:"/",
        rootpath:"/api/purchases/items"
    },
    suppliers: {
        update: saveSuppliersRow,
        remove: removeRow,
        profilePath:"/supplier/profile",
        rootpath:"/api/suppliers"
    },
    transactions: {
        update: saveTransactionRow,
        remove: removeRow,
        profilePath:"/transaction/profile",
        rootpath:"/api/transactions"
    },    
    }[mode]; 
     
    useEffect(() => {
        
        apiGet(api.rootpath,getOptions)
    .then(result => {
             
            console.log(result.results)

            
            setRows(prev => ({
    ...prev,
    columns: columns,
    data: result.results
    }));
        });
    }, [reload]);
    const columns= {
    products:[
        { label: "ID", accessor: "id" ,edit:false },
        { label: "Barcode", accessor: "barcode" ,edit:true },
        { label: "Name", accessor: "name" ,edit:true },
        { label: "Price", accessor: "price" ,edit:true },
        { label: "Quantity", accessor: "quantity" ,edit:false },
    ],
    sales:  [
        { label: "ID", accessor: "id" ,edit:false },
        { label: "Date", accessor: "date" ,edit:false },
        { label: "total", accessor: "total" ,edit:false },
        { label: "Status", accessor: "status" ,edit:false },
      ],
    purchases:  [
        { label: "ID", accessor: "id" ,edit:false },
        { label: "Date", accessor: "date" ,edit:false },
        { label: "total", accessor: "total" ,edit:false },
        { label: "Status", accessor: "status" ,edit:false },
        { label: "Description", accessor: "description" ,edit:true },
      ],  
    suppliers:  [
        { label: "ID", accessor: "id" ,edit:false },
        { label: "Name", accessor: "name" ,edit:true },
        { label: "Email", accessor: "email" ,edit:true },
        { label: "Phone", accessor: "phone" ,edit:true },
    ],
    transactions:[
          { label: "ID", accessor: "id" ,edit:false },
          { label: "Date", accessor: "date" ,edit:false },
          { label: "Amount", accessor: "amount" ,edit:false },
          { label: "Type", accessor: "type" ,edit:false },
          { label: "Note", accessor: "note" ,edit:true },
    ],
  sale_items:  [
      { label: "ID", accessor: "id" ,edit:false},
      { label: "Barcode", accessor: "barcode" ,edit:false },
      { label: "Name", accessor: "name" ,edit:false },
      { label: "Unit Price", accessor: "price" ,edit:false },
      { label: "Quantity", accessor: "quantity" ,edit:false },
      { label: "Description", accessor: "description" ,edit:false },
    ],
  purchase_items:  [
      { label: "ID", accessor: "id" ,edit:false},
      { label: "Barcode", accessor: "barcode" ,edit:false },
      { label: "Name", accessor: "name" ,edit:false },
      { label: "Purchase Price", accessor: "price" ,edit:false },
      { label: "Quantity", accessor: "quantity" ,edit:false },
    ],        
    }[mode];
    return (
        <Table
            mode={table_mode}
            TableName={TableName}
            data={rows.data}
            columns={rows.columns}
            rootpath={api.rootpath}
            setSelectedRow={setSelectedRow}
            removeRow={api.remove}
            saveRow={api.update}
            profilePath={api.profilePath}
            refreshParent={() => {
                setReload(prev => !prev);
            }}

        />    
    );
}