import React from 'react';
import { Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Sales from './components/Sales';
import ProductsAdmin from './components/products/ProductsAdmin';
import ProductsAdd from './components/products/ProductsAdd';
import ProductsEdit from './components/products/ProductsEdit';
import UsersAdmin from './components/clients/UsersAdmin';
import UsersEdit from './components/clients/UsersEdit';
import UsersAdd from './components/clients/UsersAdd';
import ClientsAdmin from './components/clients/ClientsAdmin';
import ClientsEdit from './components/clients/ClientsEdit';
import ClientsAdd from './components/clients/ClientsAdd';


function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/sales" element={<Sales />}></Route>
        <Route path="/products" element={<ProductsAdmin />}></Route>
        <Route path="/products/add" element={<ProductsAdd />}></Route>
        <Route path="/products/edit" element={<ProductsEdit />}></Route>
        <Route path="/users" element={<UsersAdmin />}></Route>
        <Route path="/users/edit" element={<UsersEdit />}></Route>
        <Route path="/users/add" element={<UsersAdd />}></Route>
        <Route path="/clients" element={<ClientsAdmin />}></Route>
        <Route path="/clients/edit" element={<ClientsEdit />}></Route>
        <Route path="/clients/add" element={<ClientsAdd />}></Route>
      </Routes>
    </div>
  );
}

export default App;
