import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

function InventoryDetailReport() {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetchInventoryDetails();
  }, []);

  const fetchInventoryDetails = async () => {
    const { data, error } = await supabase.rpc('get_inventory_detail');
    if (error) {
      console.error('Error fetching inventory details:', error.message);
      setInventoryData([]);
    } else {
      setInventoryData(data || []);
    }
  };

  return (
    <div className="reports-container">
      <h2>Reporte de Inventario Detallado</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad en Stock</th>
            <th>Ubicación</th>
            <th>Categoría</th>
            <th>Costo</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((item) => (
            <tr key={item.id_producto}>
              <td>{item.nombre_producto}</td>
              <td>{item.cantidad_stock}</td>
              <td>{item.ubicacion_almacen}</td>
              <td>{item.categoria}</td>
              <td>{item.costo}</td>
              <td>{item.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryDetailReport;