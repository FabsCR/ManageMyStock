// Importa React, hooks de estado y efecto, y la configuración de Supabase
import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

function InventoryDetailReport() {
  // Estado para almacenar los datos detallados del inventario
  const [inventoryData, setInventoryData] = useState([]);

  // Llama fetchInventoryDetails cuando el componente se monta para cargar datos
  useEffect(() => {
    fetchInventoryDetails();
  }, []);

  // Obtiene el reporte detallado del inventario usando la función 'get_inventory_detail' en Supabase
  const fetchInventoryDetails = async () => {
    const { data, error } = await supabase.rpc('get_inventory_detail');
    if (error) {
      console.error('Error fetching inventory details:', error.message);
      setInventoryData([]); // Asigna un arreglo vacío en caso de error
    } else {
      setInventoryData(data || []); // Actualiza el estado con los datos obtenidos
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