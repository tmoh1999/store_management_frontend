import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <div class="container py-5">
  <h1 class="text-center mb-5">Store Management</h1>
<h2 class="text-center mb-5">user: {{username}}</h2>
  <div class="d-flex flex-column align-items-center gap-3">

    <a href="/products/manageproducts" class="btn btn-primary w-75 p-4 shadow-lg rounded fs-5">
      📦 Manage Products
    </a>

    <a href="/sales/managesales" class="btn btn-success w-75 p-4 shadow-lg rounded fs-5">
      💰 Manage Sales
    </a>

    <a href="/suppliers/managesuppliers" class="btn btn-warning w-75 p-4 shadow-lg rounded fs-5">
      🚚 Manage Suppliers
    </a>

    <a href="/purchases/managepurchases" class="btn btn-info w-75 p-4 shadow-lg rounded fs-5">
      🛒 Manage Purchases
    </a>

    <a href="/transactions/transactions/list/Today" class="btn btn-danger w-75 p-4 shadow-lg rounded fs-5">
      🔄 Manage Transactions
    </a>

    <a href="/tools/test" class="btn btn-dark w-75 p-4 shadow-lg rounded fs-5">
      ⚙️ Test
    </a>
    <a href="/users/logout" class="btn btn-danger w-75 p-4 shadow-lg rounded fs-5">
      📤 Logout
    </a>
  </div>
</div>
    </>
  )
}

export default App
