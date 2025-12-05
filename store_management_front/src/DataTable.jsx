import { saveSuppliersRow,getSuppliers,updatePurchaseItem,getPurchaseItems,updateSaleItem,getSaleItems,removeRow } from "./api";
import Table from "./Table";
import { useState,useEffect } from "react";
export default function DataTable({mode,table_mode,TableName,setSelectedRow}){
    const [reload,setReload]=useState(false);
    const [rows,setRows]=useState({
      columns: [],
      data: []
    });
    const rootpath="/api/"+mode;
    // 1️⃣ API MAPPING BASED ON MODE
    const api = {
    sale_items: {
        get: getSaleItems,
        update: updateSaleItem,
        remove: removeRow,
    },
    purchase_items: {
        get: getPurchaseItems,
        update: updatePurchaseItem,
        remove: removeRow,
    },
    suppliers: {
        get: getSuppliers,
        update: saveSuppliersRow,
        remove: removeRow,
    }
    }[mode];    
    useEffect(() => {
        api.get()
    .then(result => {
            console.log(result.results);
            
            setRows(prev => ({
    ...prev,
    columns: columns,
    data: result.results
    }));
        });
    }, [reload]);
    const columns= {
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
          { label: "Description", accessor: "description" ,edit:false },
      ],  
    suppliers:  [
        { label: "ID", accessor: "id" ,edit:false },
        { label: "Name", accessor: "name" ,edit:true },
        { label: "Email", accessor: "email" ,edit:true },
        { label: "Phone", accessor: "phone" ,edit:true },
    ]  
    }[mode];    
    return (
        <Table
            mode={table_mode}
            TableName={TableName}
            data={rows.data}
            columns={rows.columns}
            rootpath={rootpath}
            setSelectedRow={setSelectedRow}
            removeRow={api.remove}
            saveRow={api.update}
            refreshParent={() => {
                setReload(prev => !prev);
            }}

        />    
    );
}