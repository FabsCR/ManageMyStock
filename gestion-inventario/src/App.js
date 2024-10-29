import React, { useEffect, useState } from 'react';
import supabase from './config/supabaseClient';

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase.from('productos').select('*');
      if (error) {
        console.error("Error al obtener productos:", error);
      } else {
        setProductos(data);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="App">
      <h1>Lista de Productos</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id_producto}>
            {producto.nombre_producto} - ₡{producto.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;