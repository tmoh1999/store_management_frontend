import {Link} from "react-router-dom"
export default function Suppliers(){

    return(
        <div className="flex p-6">
            <Link
                to="/addsupplier"
                className="p-2 mr-8 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
                >
                Add Supplier
            </Link>
        </div>
    );
}