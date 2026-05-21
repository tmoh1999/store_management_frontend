import {saveProductRow,saveSuppliersRow,updatePurchaseItem,updateSaleItem,removeRow, apiGet, savePurchaseRow
    , saveTransactionRow ,addProduct,addSupplier, addCustomer, saveCustomersRow, addRefund, updateRefund, updateRefundItem} from "./api";
import Table from "./Table";
import { useState,useEffect } from "react";
import { getLocalDate } from "./utils";
import NoDataFound from "./components/NoDataFound";
export default function DataTable({mode,table_mode="view",TableName="table",SelectName="Select",Edit=false,
    setSelectedRow,setTotal=null,getOptions,refreshParent2=()=>{},refreshKey=0}){
    const [reload,setReload]=useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rows,setRows]=useState({
      columns: [],
      data: []
    });

    const [dateRange, setDateRange] = useState({
        start_date: getLocalDate(),
        end_date: getLocalDate()
    });       
    const [page,setPage]=useState(1);
    const [totalPages,setTotalPages]=useState(1);
    const [search, setSearch] = useState("");
    const [sortColumn, setSortColumn] = useState("__default__");
    const [sortOrder, setSortOrder] = useState("desc");
    // 1️⃣ API MAPPING BASED ON MODE
    const api = {
    products: {
        add: addProduct,
        update: saveProductRow,
        remove: removeRow,
        profilePath:"/product/profile",
        profileKeys:["id"],
        rootpath:"/api/products",
        showDates:false,
    },
    sales: {
        update: null,
        add: null,
        remove: removeRow,
        profilePath:"/sale/profile",
        profileKeys:["id"],
        rootpath:"/api/sales",
        showDates:true,
    },               
    sale_items: {
        add: null,
        update: updateSaleItem,
        remove: removeRow,
        profilePath:null,
        profileKeys:[],
        rootpath:"/api/sales/items",
        showDates:false,
    },
    purchases: {
        add:null,
        update: savePurchaseRow,
        remove: removeRow,
        profilePath:"/purchase/profile",
        profileKeys:["id"],
        rootpath:"/api/purchases",
        showDates:true,
    },
    purchase_items: {
        add:null,
        update: updatePurchaseItem,
        remove: removeRow,
        profilePath:null,
        profileKeys:[],        
        rootpath:"/api/purchases/items",
        showDates:false,
    },
    suppliers: {
        add: addSupplier,
        update: saveSuppliersRow,
        remove: removeRow,
        profilePath:"/supplier/profile",
        profileKeys:["id"],
        rootpath:"/api/suppliers",
        showDates:false,
    },
    transactions: {
        add:null,
        update: saveTransactionRow,
        remove: removeRow,
        profilePath:"/transaction/profile",
        profileKeys:["id"],
        rootpath:"/api/transactions",
        showDates:true,
    }, 
    customers: {
        add: addCustomer,
        update: saveCustomersRow,
        remove: removeRow,
        profilePath:"/customer/profile",
        profileKeys:["id"],
        rootpath:"/api/customers",
        showDates:false,
    },   
    refunds: {
        add: null,
        update: updateRefund,
        remove: removeRow,
        profilePath:"/refund/profile",
        profileKeys:["id"],
        rootpath:"/api/refunds",
        showDates:true,
    },  
    refund_items: {
        add:null,
        update: updateRefundItem,
        remove: removeRow,
        profilePath:null,
        rootpath:"/api/refunds/items",
        profileKeys:[],
        showDates:false,
    },         
    }[mode]; 
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
      { label: "Unit Price", accessor: "price",edit:true },
      { label: "Discount", accessor: "discount",edit:true },
      { label: "Discount Type", accessor: "discount_type",edit:true },
      { label: "Final Price", accessor: "final_price",edit:false },      
      { label: "Quantity", accessor: "quantity",edit:true },
      { label: "Description", accessor: "description",edit:true },
    ],
  purchase_items:  [
      { label: "ID", accessor: "id",edit:false},
      { label: "Barcode", accessor: "barcode",edit:false },
      { label: "Name", accessor: "name",edit:false },
      { label: "Purchase Price", accessor: "price",edit:true },
      { label: "Quantity", accessor: "quantity",edit:true },
      { label: "Remain Quantity", accessor: "remain_quantity",edit:false },
    ],  
    customers:  [
        { label: "ID", accessor: "id",edit:false },
        { label: "Name", accessor: "name",edit:true },
        { label: "Email", accessor: "email",edit:true },
        { label: "Phone", accessor: "phone",edit:true },
    ],    
    refunds:  [
        { label: "ID", accessor: "id",edit:false },
        { label: "Date", accessor: "date",edit:false },
        { label: "Receipt Number", accessor: "receipt_number",edit:false },
        { label: "Amount", accessor: "amount",edit:false },
        { label: "Status", accessor: "status",edit:false },
        { label: "Reason", accessor: "reason",edit:true },
    ],
    refund_items:  [
        { label: "ID", accessor: "id",edit:false},
        { label: "Amount", accessor: "amount",edit:true },
        { label: "Quantity", accessor: "quantity",edit:true },
    ],               
    }[mode];
  
    useEffect(() => {
        setLoading(true);
        setError("");
        console.log(getOptions);
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
                if(result?.success){
                    console.log(result);    
                    setRows(prev => ({
                        ...prev,
                        columns: columns,
                        data: result.results
                    }));
                    setTotalPages(result.total_pages);
                    if(setTotal && result?.total){
                        setTotal(result.total);
                    }
                }else{
                    setError(result.message);
                }
            })
        .catch(err => {
            setError(err.message);
        })
        .finally(() => {
            setLoading(false);
        });
      
    }, [refreshKey,reload,page,sortColumn,sortOrder]);


    useEffect(() => {
        
        const timeout = setTimeout(() => {
            if (search) {
                console.log("search"+search);
                page!==1? setPage(1) :setReload(prev=>!prev);
            }else{
                setReload(prev=>!prev);
            }
        }, 200);

        return () => clearTimeout(timeout);
    }, [search]);    
    
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
            {error?(
                <div className="flex flex-col h-screen justify-center items-center p-6 bg-gray-300">  
                    <div className="w-3/4">
                        <NoDataFound message={error}/>
                    </div>
                </div>
            ):(            
                <Table
                    mode={table_mode}
                    TableName={TableName}
                    SelectName={SelectName}
                    data={rows.data}
                    columns={rows.columns}
                    rootpath={api.rootpath}
                    setSelectedRow={setSelectedRow}
                    addRow={api.add}
                    removeRow={api.remove}
                    saveRow={api.update}
                    profilePath={api.profilePath}
                    profileKeys={api.profileKeys}
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
                    loading={loading}
                    Edit={Edit}

                />
            )}
        </>
    );
}