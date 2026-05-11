import { test,saveProductRow,getProducts,saveSuppliersRow,getSuppliers,updatePurchaseItem,getPurchaseItems,updateSaleItem,getSaleItems,removeRow, apiGet, savePurchaseRow, saveTransactionRow ,addProduct,addSupplier, addCustomer, saveCustomersRow, addRefund, updateRefund} from "./api";
import Table from "./Table";
import { useState,useEffect } from "react";
export default function DataTable({mode,table_mode="view",TableName="table",
    setSelectedRow,getOptions,refreshParent2=()=>{}}){
    const [reload,setReload]=useState(false);
    const [rows,setRows]=useState({
      columns: [],
      data: []
    });
    const [dateRange,setDateRange]=useState({
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10)
    });    
    const [page,setPage]=useState(1);
    const [totalPages,setTotalPages]=useState(1);
    const [search, setSearch] = useState("");
    const [sortColumn, setSortColumn] = useState("__default__");
    const [sortOrder, setSortOrder] = useState("desc");    
    // 1️⃣ API MAPPING BASED ON MODE
    const api = {
    products: {
        get: getProducts,
        add: addProduct,
        update: saveProductRow,
        remove: removeRow,
        profilePath:"/product/profile",
        rootpath:"/api/products",
        showDates:false,
    },
    sales: {
        update: null,
        add: null,
        remove: removeRow,
        profilePath:"/sale/profile",
        rootpath:"/api/sales",
        showDates:true,
    },               
    sale_items: {
        add: null,
        update: updateSaleItem,
        remove: removeRow,
        profilePath:"/",
        rootpath:"/api/sales/items",
        showDates:false,
    },
    purchases: {
        add:null,
        update: savePurchaseRow,
        remove: removeRow,
        profilePath:"/purchase/profile",
        rootpath:"/api/purchases",
        showDates:true,
    },
    purchase_items: {
        add:null,
        update: updatePurchaseItem,
        remove: removeRow,
        profilePath:"/",
        rootpath:"/api/purchases/items",
        showDates:false,
    },
    suppliers: {
        add: addSupplier,
        update: saveSuppliersRow,
        remove: removeRow,
        profilePath:"/supplier/profile",
        rootpath:"/api/suppliers",
        showDates:false,
    },
    transactions: {
        add:null,
        update: saveTransactionRow,
        remove: removeRow,
        profilePath:"/transaction/profile",
        rootpath:"/api/transactions",
        showDates:true,
    }, 
    customers: {
        add: addCustomer,
        update: saveCustomersRow,
        remove: removeRow,
        profilePath:"/customer/profile",
        rootpath:"/api/customers",
        showDates:false,
    },   
    refunds: {
        add: addRefund,
        update: updateRefund,
        remove: removeRow,
        profilePath:"/",
        rootpath:"/api/refunds",
        showDates:true,
    },       
    }[mode]; 
    
    useEffect(() => {
    console.log("sortColumn:",sortColumn,"sortOrder:",sortOrder);
    const op=
        api.showDates?     
        {
            ...getOptions,
            start_date:dateRange.start_date,
            end_date:dateRange.end_date,
            page:page,sort_column:sortColumn,sort_direction:sortOrder,search:search
        }
        :
        {...getOptions,page:page,sort_column:sortColumn,sort_direction:sortOrder,search:search}
    ;
        apiGet(api.rootpath,op)
    .then(result => {
             
            console.log(result.total_pages);

            
            setRows(prev => ({
    ...prev,
    columns: columns,
    data: result.results
    }));
    setTotalPages(result.total_pages);
        });
    refreshParent2();    
    }, [reload,page,sortColumn,sortOrder]);
    const columns= {
    products:[
        { label: "ID", accessor: "id",edit:false },
        { label: "Barcode", accessor: "barcode",edit:true },
        { label: "Name", accessor: "name",edit:true },
        { label: "Price", accessor: "price",edit:true },
        { label: "Quantity", accessor: "quantity",edit:false },
        {label: "Min Stock", accessor: "min_stock_level",edit:true },
    ],
    sales:  [
        { label: "ID", accessor: "id",edit:false },
        { label: "Date", accessor: "date",edit:false },
        { label: "Receipt N°", accessor: "receipt_number",edit:false },
        { label: "Total", accessor: "total",edit:false },
        { label: "Discounts", accessor: "total_discount",edit:false },
        { label: "Final Amount", accessor: "final_amount",edit:false },
        { label: "Status", accessor: "status",edit:false },
      ],
    purchases:  [
        { label: "ID", accessor: "id",edit:false },
        { label: "Date", accessor: "date",edit:false },
        { label: "total", accessor: "total",edit:false },
        { label: "Status", accessor: "status",edit:false },
        { label: "Description", accessor: "description",edit:true },
      ],  
    suppliers:  [
        { label: "ID", accessor: "id",edit:false },
        { label: "Name", accessor: "name",edit:true },
        { label: "Email", accessor: "email",edit:true },
        { label: "Phone", accessor: "phone",edit:true },
    ],
    transactions:[
          { label: "ID", accessor: "id",edit:false },
          { label: "Date", accessor: "date",edit:false },
          { label: "Amount", accessor: "amount",edit:false },
          { label: "Type", accessor: "type",edit:false },
          { label: "Source", accessor: "source",edit:false },
          {label: "Category", accessor: "category",edit:false },
          { label: "Note", accessor: "note",edit:true },
    ],
  sale_items:  [
      { label: "ID", accessor: "id",edit:false},
      { label: "Barcode", accessor: "barcode",edit:false },
      { label: "Name", accessor: "name",edit:false },
      { label: "Unit Price", accessor: "price",edit:false },
      { label: "Discount", accessor: "discount",edit:false },
      { label: "Discount Type", accessor: "discount_type",edit:false },
      { label: "Final Price", accessor: "final_price",edit:false },      
      { label: "Quantity", accessor: "quantity",edit:false },
      { label: "Description", accessor: "description",edit:false },
    ],
  purchase_items:  [
      { label: "ID", accessor: "id",edit:false},
      { label: "Barcode", accessor: "barcode",edit:false },
      { label: "Name", accessor: "name",edit:false },
      { label: "Purchase Price", accessor: "price",edit:false },
      { label: "Quantity", accessor: "quantity",edit:false },
    ],  
    customers:  [
        { label: "ID", accessor: "id",edit:false },
        { label: "Name", accessor: "name",edit:true },
        { label: "Email", accessor: "email",edit:true },
        { label: "Phone", accessor: "phone",edit:true },
    ],    
    refunds:  [
        { label: "ID", accessor: "id",edit:false },
        { label: "Date", accessor: "date",edit:true },
        { label: "Receipt Number", accessor: "receipt_number",edit:true },
        { label: "Amount", accessor: "amount",edit:true },
        { label: "Status", accessor: "status",edit:true },
        { label: "Reason", accessor: "reason",edit:true },
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
            addRow={api.add}
            removeRow={api.remove}
            saveRow={api.update}
            profilePath={api.profilePath}
            setPage={setPage}
            page={page}
            pages={totalPages}
            search={search} setSearch={setSearch}
            sortColumn={sortColumn} setSortColumn={setSortColumn}
            sortOrder={sortOrder} setSortOrder={setSortOrder}
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