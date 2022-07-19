import React from "react";
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import config from './../helpers/config.json';
import { useNavigate } from "react-router";

class Sales extends React.Component{

    state = {
        clientList: [],
        productList: [],
        product: {
            id: "",
            name: "",
            price: "",
            MSU: 0,
            stock: 0,
            MDPrice: 0,
            MDPercentge: 0,
            active: true,
            total:0,
        },
        cart:[],
        resumen:{
            neto: 0,
            taxs: 0,
            otherTaxs: 0,
            final: 0,
        }

    }



    calculateTotal = () => {
        let product = this.state.product;
        let qty = document.getElementById("qty").value;
        let discount = document.getElementById("discount").value;
        let isPercentage = discount.indexOf("%") > -1;
        if(isPercentage){
            discount = discount.replace ("%","") / 100;
            product.total = (product.price * qty)-(product.price * qty * discount);
        }else{
            product.total = (product.price * qty)-discount;
        }
        this.setState({
            product: product,
        });
    }

    addToCart = () => {
        let product = this.state.product;
        let errors = "";
        let qty = document.getElementById("qty").value;
        let discount = document.getElementById("discount").value;
        let isPercentage = discount.indexOf("%") > -1;
        errors += product.name === "" ? "Seleccione un producto\n" : "";
        errors += qty === "" ? "Se necesita la cantidad\n" : "";
        errors += isPercentage && parseInt(discount.replace("%", "")) > product.MDPercentge ? "No puede descontar más del" + product.MDPercentge + "%\n" : "";
        errors += !isPercentage && parseInt(discount) > product.MDPrice ? "No puede descontar más de $" + product.MDPrice + ".\n" : "";
        errors += qty > product.stock ? "No puede vender más de" + product.stock + "productos\n" : "";
        if (errors.length > 0){
            alert(errors);
        }else {
            let cartRow = {productId: product.id, productName: product.name, qty:qty, price: product.price, discount: discount, total: product.total};
            this.setState({
                cart:[...this.state.cart, cartRow]
            });
            this.getResumen();
        }

    }

    saveToOrder=()=> {
        let navigate = useNavigate();
        let resumen = this.state.resumen;
        let errors = "";
        let type = document.getElementById("type").value;
        let document = document.getElementById("document").value;
        errors += type === "" ? "Seleccione un Tipo de Venta\n":"";
        errors += document === "" ? "Seleccione un Tipo de Documento\n":"";
        if (errors.length > 0){
            alert(errors);
        }else {
            const requestOptions={
                method:'GET',
                header:{ 'Content-Type': 'application/json'},
                body: JSON.stringify({"operatorId":config.operatorId})
            }
            fetch(config.apiURL+"sales", requestOptions).then((response) => {
                switch(response.status){
                  case 400:
                    console.log("consulta mal formada");
                    break;
                  case 403:
                    console.log("acceso prohibido");
                    break;
                  default:
                    //
                }
                return response.json();
              }).then((result) => {
                  window.alert("Regitro existoso");
                  navigate("/sales");
              })
        }   

    }

    removeCartItem =(item) =>{
        let cart = this.state.cart;
        let index = cart.indexOf(item);
        cart.splice(index, 1);
        this.setState({
            cart: cart
        });
        this.getResumen();
    }

    getResumen =() =>{
        setTimeout(() =>{
            let cart = this.state.cart;
            var res = {
                neto: 0,
                taxs: 0,
                otherTaxs: 0,
                final: 0,
            }
            cart.forEach(item => {
                res.neto += item.total;
            });
            res.taxs = res.neto * 0.19;
            res.otherTaxs = 0;
            res.final = res.neto + res.taxs + res.otherTaxs;
            this.setState({
                resumen: res
            });
        },200)

    }

    selectProduct = (event) => {
        let product = this.state.productList.find(product => product.id === event.target.value);
        console.log(product);
        this.setState({
            product: product
        });
    }

    componentDidMount() {
        const requestOptions = {
            method: 'GET', headers: { 'Content-Type': 'application/json'}
        };
        fetch(config.apiURL+"clients/"+config.operatorId, requestOptions).then((response) => {
            return response.json();
        }).then((result) => {
            this.setState({ clientList: result.data.map((client) => { return client; }) });
        });

        fetch(config.apiURL+"products/"+config.operatorId, requestOptions).then((response) => {
            return response.json();
        }).then((result) => {
            this.setState({ productList: result.data.map((product) => { return product; }) });
        });
    }

    render() {
       const {clientList, productList} = this.state;
       return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Panel de Ventas</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="/#">Cloud Sales</a></li>
                                    <li className="breadcrumb-item active">Ventas</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-10">
                                    <div className="form-group">
                                        <label className="control-label">Cliente</label>
                                        <select name="client" id="client" className="form-control">
                                            <option value="0">--Seleccione</option>
                                            {clientList.map(client => (
                                                <option key={client.id} value={client.id}>
                                                    {client.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <label  className="control-label label-empty" />
                                    <button className="btn btn-success"><i className="fas fa-chevron-right" /></button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <hr />
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="control-label">Producto</label>
                                        <select name="product" id="product" className="form-control" onChange={this.selectProduct}>
                                            <option value="0">--Seleccione</option>
                                            {productList.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label className="label-control">U.M.V.</label>
                                        <input className="form-control" type="text" name="msv" id="msv" readOnly={true} value={this.state.product.MSU} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label className="label-control" >Stock</label>
                                        <input className="form-control" type="text" name="stock" id="stock" readOnly={true} value={this.state.product.stock} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label className="label-control" >Cantidad</label>
                                        <input className="form-control" type="number" name="qty" id="qty" onChange={this.calculateTotal}/>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label className="label-control">Unitario</label>
                                        <input className="form-control" type="text" name="unitary" id="unitary" readOnly={true} value={this.state.product.price} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label className="label-control" >Descuento</label>
                                        <input className="form-control" type="text" name="discount" id="discount" onChange={this.calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label className="label-control" >Total</label>
                                        <input className="form-control" type="number" name="total" id="total" readOnly={true} value = {this.state.product.total}/>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-primary btn-block" onClick={this.addToCart}>
                                        <i className="fas fa-cart-plus" />Agregar
                                    </button>
                                </div>
                                <div className="col-12">
                                    <hr />
                                </div>
                                <div className="col-12">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Total</th>
                                                <th>Accion</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.cart.map(cl =>(
                                            <tr>
                                                <td>{cl.productName}</td>
                                                <td>{cl.qty}</td>
                                                <td>{cl.total}</td>
                                                <td>
                                                    <button className="btn btn-danger" onClick={this.removeCartItem.bind(cl)}>
                                                        <i className="fas fa-trash"/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}    
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-6">
                                    <label className="control-label">Neto</label>
                                    <input className="form-control" type="text" name="neto" id="neto" readOnly={true} value={this.state.resumen.neto} />
                                </div>
                                <div className="col-6">
                                    <label className="control-label">IVA</label>
                                    <input className="form-control" type="text" name="tax" id="tax" readOnly={true} value={this.state.resumen.taxs}/>
                                </div>
                                <div className="col-6">
                                    <label className="control-label">Otros Impuestos</label>
                                    <input className="form-control" type="text" name="otherTaxs" id="otherTaxs" readOnly={true} value={this.state.resumen.otherTaxs}/>
                                </div>
                                <div className="col-6">
                                    <label className="control-label">Total</label>
                                    <input className="form-control" type="text" name="final" id="final" readOnly={true} value={this.state.resumen.final}/>
                                </div>
                                <div className="col-12">
                                    <hr />
                                </div>
                                <div className="col-6">
                                    <label className="control-label">Tipo de Venta</label>
                                    <select className="form-control" name="type" id="type">
                                        <option value="0">-- --Seleccione</option>
                                        <option value="1">-- --Afecta</option>
                                        <option value="2">-- --Exenta</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="control-label">Tipo de Documento</label>
                                    <select className="form-control" name="document" id="document">
                                        <option value="0">-- --Seleccione</option>
                                        <option value="1">-- --Factura Electrónica</option>
                                        <option value="2">-- --Factura Exenta Electrónica</option>
                                        <option value="3">-- --Boleta</option>
                                        <option value="4">-- --Guía de Despacho Electrónica</option>
                                    </select>
                                    <button className="btn btn-primary btn-block" onClick={this.saveToOrder}>
                                        <i className='fa fa-save'/> Guardar Pedido
                                    </button>
                                </div>
                                <div className="col-12 text-center">
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
       )
    }
}
export default Sales;