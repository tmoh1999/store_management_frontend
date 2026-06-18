
import { Link } from "react-router-dom";
import UploadFile from "../UploadFile"
import DataTable from "../DataTable";
// you will create these pages

export default function ProductList() {
  return (
    <div className="flex justify-center min-w-fit  p-3">
      <div className="sm:w-3/4 min-w-[700px]">
      
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
          <DataTable mode="products" TableName="Products" Edit={true}/> 
      </div>
    </div>
  );
}