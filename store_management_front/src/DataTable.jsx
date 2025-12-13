import { test,saveProductRow,getProducts,saveSuppliersRow,getSuppliers,updatePurchaseItem,getPurchaseItems,updateSaleItem,getSaleItems,removeRow, apiGet, savePurchaseRow, saveTransactionRow } from "./api";
import Table from "./Table";
import { useState,useEffect } from "react";
export default function DataTable({mode,table_mode="view",TableName="table",setSelectedRow,getOptions,refreshParent2=()=>{}}){
    const [reload,setReload]=useState(false);
    const [rows,setRows]=useState({
      columns: [],
      data: []
    });
    const [dateRange,setDateRange]=useState({
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10)
    });    
    // 1️⃣ API MAPPING BASED ON MODE
    const api = {
    products: {
        get: getProducts,
        update: saveProductRow,
        remove: removeRow,
        profilePath:"/product/profile",
        rootpath:"/api/products",
        showDates:false,
    },
    sales: {
        update: null,
        remove: removeRow,
        profilePath:"/sale/profile",
        rootpath:"/api/sales",
        showDates:true,
    },               
    sale_items: {
        update: updateSaleItem,
        remove: removeRow,
        profilePath:"/",
        rootpath:"/api/sales/items",
        showDates:false,
    },
    purchases: {
        update: savePurchaseRow,
        remove: removeRow,
        profilePath:"/purchase/profile",
        rootpath:"/api/purchases",
        showDates:true,
    },
    purchase_items: {
        update: updatePurchaseItem,
        remove: removeRow,
        profilePath:"/",
        rootpath:"/api/purchases/items",
        showDates:false,
    },
    suppliers: {
        update: saveSuppliersRow,
        remove: removeRow,
        profilePath:"/supplier/profile",
        rootpath:"/api/suppliers",
        showDates:false,
    },
    transactions: {
        update: saveTransactionRow,
        remove: removeRow,
        profilePath:"/transaction/profile",
        rootpath:"/api/transactions",
        showDates:true,
    },    
    }[mode]; 
    
    useEffect(() => {
    const op=
        api.showDates?     
        {
            ...getOptions,
            start_date:dateRange.start_date,
            end_date:dateRange.end_date
        }
        :
        getOptions
    ;
        apiGet(api.rootpath,op)
    .then(result => {
             
            //console.log(result.results)

            
            setRows(prev => ({
    ...prev,
    columns: columns,
    data: result.results
    }));
        });
    refreshParent2();    
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
    const handleChange= (e)=>{
        const x=e.target;
        setDateRange(prev =>({
            ...prev,
            [x.name]:x.value
        }));
    };
    
    useEffect(()=>{
        setReload(prev=>!prev);
    },[dateRange]);
 
    return (
        <>
        {api.showDates &&
        <div className="flex justify-center mb-3 mt-7">
            <div>
                <label htmlFor="start_date" className="text-2xl font-medium mr-3">Start:</label>
                <input type="date" id="start_date" name="start_date" 
                className="bg-blue-400 text-xl p-1 rounded-xl shadow-lg text-center font-medium" 
                value={dateRange.start_date} onChange={handleChange}/>
            </div>
            <div className="ml-8">
                 <label htmlFor="end_date" className="text-2xl font-medium mr-3">End:</label>
                <input type="date" id="end_date" name="end_date"
                className="bg-blue-400 text-xl p-1 rounded-xl shadow-lg text-center font-medium"
                value={dateRange.end_date} onChange={handleChange}/>
            </div>

        </div>
        }
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
            options={
                api.showDates?     
                {
                    ...getOptions,
                    start_date:dateRange.start_date,
                    end_date:dateRange.end_date
                }
                :
                getOptions
            }
            refreshParent={() => {
                setReload(prev => !prev);
            }}

        />
        </>    
    );
}