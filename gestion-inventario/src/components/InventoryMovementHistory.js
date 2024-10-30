import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

function InventoryMovementHistory() {
  const [movementData, setMovementData] = useState([]);

  useEffect(() => {
    fetchMovementHistory();
  }, []);

  const fetchMovementHistory = async () => {
    const { data, error } = await supabase.rpc('get_inventory_movements');
    if (error) {
      console.error('Error fetching inventory movements:', error.message);
      setMovementData([]);
    } else {
      setMovementData(data || []);
    }
  };

  return (
    <div className="reports-container">
      <h2>Historial de Movimientos de Inventario</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Fecha Movimiento</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {movementData.map((item) => (
            <tr key={item.id_movimiento}>
              <td>{item.nombre_producto}</td>
              <td>{item.fecha_movimiento}</td>
              <td>{item.tipo_movimiento}</td>
              <td>{item.cantidad}</td>
              <td>{item.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryMovementHistory;