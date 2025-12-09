
import Table from "../Table";
import { useEffect ,useState} from "react";
import { Link ,useLocation} from "react-router-dom";
import {login,getProducts,downloadFile,removeRow,saveProductRow} from "../api";
import UploadFile from "../UploadFile"
import DataTable from "../DataTable";
// you will create these pages

export default function ProductList() {
  return (
    <div className="flex justify-center p-3">
      <div className="w-fit">
      
      
        <div className="flex justify-end ">
            <Link
                    to="/addproduct"
                    className="p-2 mr-8 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
                  >
                  Add Product
              </Link>
              
            <button
                    className="p-2 mr-8 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
                    onClick={(e) => downloadFile('/api/products/export',"products.xlsx")}
                  >
                  Export to excel file
              </button>
              <button
                    className="p-2 mr-8 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
                    onClick={(e) => downloadFile('/api/products/products.pdf',"products.pdf")}
                  >
                  Export to pdf fil
              </button>
        </div>
        <div className="flex justify-end ">
        <UploadFile apiPath="/api/products/import" fileType=".xlsx"/>
        </div>
          <DataTable mode="products" TableName="Products"/> 
        </div>
    </div>
  );
}