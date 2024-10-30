import React, { useState } from 'react';
import ProductManager from './components/ProductManager';
import ClientManager from './components/ClientManager';
import OrderManager from './components/OrderManager';
import InventoryMovementsManager from './components/InventoryMovementsManager';
import SupplierManager from './components/SupplierManager';
import OrderDetailsManager from './components/OrderDetailsManager';
import Reports from './components/Reports';
import InventoryDetailReport from './components/InventoryDetailReport';
import InventoryMovementHistory from './components/InventoryMovementHistory';
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
      case 'reportesCompras':
        return <Reports />;
      case 'reporteInventario':
        return <InventoryDetailReport />;
      case 'historialMovimientos':
        return <InventoryMovementHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <h1>Gestión de Inventario Supermercado</h1>
      <div className="tab-container">
        <button className={`tab-button ${activeTab === 'productos' ? 'active' : ''}`} onClick={() => setActiveTab('productos')}>Productos</button>
        <button className={`tab-button ${activeTab === 'clientes' ? 'active' : ''}`} onClick={() => setActiveTab('clientes')}>Clientes</button>
        <button className={`tab-button ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => setActiveTab('pedidos')}>Pedidos</button>
        <button className={`tab-button ${activeTab === 'movimientos' ? 'active' : ''}`} onClick={() => setActiveTab('movimientos')}>Movimientos</button>
        <button className={`tab-button ${activeTab === 'proveedores' ? 'active' : ''}`} onClick={() => setActiveTab('proveedores')}>Proveedores</button>
        <button className={`tab-button ${activeTab === 'detallesPedidos' ? 'active' : ''}`} onClick={() => setActiveTab('detallesPedidos')}>Detalles de Pedidos</button>
        <button className={`tab-button ${activeTab === 'reportesCompras' ? 'active' : ''}`} onClick={() => setActiveTab('reportesCompras')}>Reporte de Compras</button>
        <button className={`tab-button ${activeTab === 'reporteInventario' ? 'active' : ''}`} onClick={() => setActiveTab('reporteInventario')}>Reporte de Inventario</button>
        <button className={`tab-button ${activeTab === 'historialMovimientos' ? 'active' : ''}`} onClick={() => setActiveTab('historialMovimientos')}>Historial de Movimientos</button>
      </div>
      <div className="content-container">{renderContent()}</div>
    </div>
  );
}

export default App;