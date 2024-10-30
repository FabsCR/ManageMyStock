import React, { useState } from 'react';
import ProductManager from './components/ProductManager';
import ClientManager from './components/ClientManager';
import OrderManager from './components/OrderManager';
import InventoryMovementsManager from './components/InventoryMovementsManager';
import SupplierManager from './components/SupplierManager';
import OrderDetailsManager from './components/OrderDetailsManager';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('productos');

  const renderContent = () => {
    switch (activeTab) {
      case 'productos':
        return <ProductManager />;
      case 'clientes':
        return <ClientManager />;
      case 'pedidos':
        return <OrderManager />;
      case 'movimientos':
        return <InventoryMovementsManager />;
      case 'proveedores':
        return <SupplierManager />;
      case 'detallesPedidos':
        return <OrderDetailsManager />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <h1>Gestión de Inventario</h1>
      <div className="tab-container">
        <button className={`tab-button ${activeTab === 'productos' ? 'active' : ''}`} onClick={() => setActiveTab('productos')}>Productos</button>
        <button className={`tab-button ${activeTab === 'clientes' ? 'active' : ''}`} onClick={() => setActiveTab('clientes')}>Clientes</button>
        <button className={`tab-button ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => setActiveTab('pedidos')}>Pedidos</button>
        <button className={`tab-button ${activeTab === 'movimientos' ? 'active' : ''}`} onClick={() => setActiveTab('movimientos')}>Movimientos</button>
        <button className={`tab-button ${activeTab === 'proveedores' ? 'active' : ''}`} onClick={() => setActiveTab('proveedores')}>Proveedores</button>
        <button className={`tab-button ${activeTab === 'detallesPedidos' ? 'active' : ''}`} onClick={() => setActiveTab('detallesPedidos')}>Detalles de Pedidos</button>
      </div>
      <div className="content-container">{renderContent()}</div>
    </div>
  );
}

export default App;