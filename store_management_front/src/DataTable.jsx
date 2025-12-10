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
        profilePath:"/sale/profile",
        rootpath:"/api/sales"
    },               
    sale_items: {
        update: updateSaleItem,
        remove: removeRow,
        profilePath:"/",
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
        { label: "ID", accessor: "id",db_name:"product_id" ,edit:false },
        { label: "Barcode", accessor: "barcode",db_name:"barcode" ,edit:true },
        { label: "Name", accessor: "name",db_name:"name" ,edit:true },
        { label: "Price", accessor: "price",db_name:"current_price" ,edit:true },
        { label: "Quantity", accessor: "quantity",db_name:"quantity_float" ,edit:false },
    ],
    sales:  [
        { label: "ID", accessor: "id",db_name:"sale_id",edit:false },
        { label: "Date", accessor: "date",db_name:"sale_date" ,edit:false },
        { label: "total", accessor: "total",db_name:"total_amount" ,edit:false },
        { label: "Status", accessor: "status",db_name:"status" ,edit:false },
      ],
    purchases:  [
        { label: "ID", accessor: "id",db_name:"purchase_id" ,edit:false },
        { label: "Date", accessor: "date",db_name:"purchase_date" ,edit:false },
        { label: "total", accessor: "total",db_name:"total_amount" ,edit:false },
        { label: "Status", accessor: "status",db_name:"status" ,edit:false },
        { label: "Description", accessor: "description",db_name:"description" ,edit:true },
      ],  
    suppliers:  [
        { label: "ID", accessor: "id",db_name:"supplier_id" ,edit:false },
        { label: "Name", accessor: "name",db_name:"name" ,edit:true },
        { label: "Email", accessor: "email",db_name:"email" ,edit:true },
        { label: "Phone", accessor: "phone",db_name:"phone" ,edit:true },
    ],
    transactions:[
          { label: "ID", accessor: "id",db_name:"transaction_id" ,edit:false },
          { label: "Date", accessor: "date",db_name:"date" ,edit:false },
          { label: "Amount", accessor: "amount",db_name:"amount" ,edit:false },
          { label: "Type", accessor: "type",db_name:"type" ,edit:false },
          { label: "Note", accessor: "note",db_name:"note" ,edit:true },
    ],
  sale_items:  [
      { label: "ID", accessor: "id",db_name:"item_id" ,edit:false},
      { label: "Barcode", accessor: "barcode",db_name:"barcode" ,edit:false },
      { label: "Name", accessor: "name",db_name:"name" ,edit:false },
      { label: "Unit Price", accessor: "price",db_name:"unit_price" ,edit:false },
      { label: "Quantity", accessor: "quantity",db_name:"quantity_float" ,edit:false },
      { label: "Description", accessor: "description",db_name:"description" ,edit:false },
    ],
  purchase_items:  [
      { label: "ID", accessor: "id",db_name:"purchase_item_id" ,edit:false},
      { label: "Barcode", accessor: "barcode",db_name:"barcode" ,edit:false },
      { label: "Name", accessor: "name",db_name:"name" ,edit:false },
      { label: "Purchase Price", accessor: "price",db_name:"purchase_price" ,edit:false },
      { label: "Quantity", accessor: "quantity",db_name:"quantity_float" ,edit:false },
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