
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
      
        <div className="flex justify-center ">
          <UploadFile apiPath="/api/products/import" fileType=".xlsx"/>
        </div>     
        <div className="flex justify-end mb-3">
          <Link
                  to="/addproduct"
                  className="p-2 rounded-xl shadow-lg text-white bg-green-600 text-center text-2xl font-medium hover:bg-green-700"
                >
                Add Product
            </Link>
        </div>
          <DataTable mode="products" TableName="Products"/> 
      </div>
    </div>
  );
}