// Importa React, hooks de estado y efecto, y la configuración de Supabase
import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import '../App.css';

function OrderDetailsManager() {
  // Estados para manejar los detalles de pedidos, formulario, y las selecciones de edición o eliminación
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailToDelete, setDetailToDelete] = useState(null);
  const [form, setForm] = useState({
    id_pedido: '',
    id_producto: '',
    cantidad: '',
    precio_unitario: ''
  });

  // Ejecuta fetchOrderDetails al montar el componente para cargar los detalles de pedidos
  useEffect(() => {
    fetchOrderDetails();
  }, []);

  // Obtiene la lista de detalles de pedidos desde la tabla "detallepedidos" en Supabase
  const fetchOrderDetails = async () => {
    const { data, error } = await supabase.from('detallepedidos').select('*');
    if (!error) setOrderDetails(data);
  };

  // Actualiza el formulario con los datos del detalle seleccionado para editar
  const handleSelectDetail = (detail) => {
    setSelectedDetail(detail);
    setForm(detail);
  };

  // Actualiza el estado del formulario cada vez que el usuario cambia un campo
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario, guardando o actualizando el detalle de pedido en Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDetail) {
      // Actualiza el detalle si ya existe
      await supabase.from('detallepedidos').update(form).eq('id_detalle', selectedDetail.id_detalle);
    } else {
      // Inserta un nuevo detalle si no existe
      await supabase.from('detallepedidos').insert([form]);
    }
    fetchOrderDetails(); // Recarga los detalles de pedidos para reflejar los cambios
    handleClearForm(); // Limpia el formulario después de enviar
  };

  // Configura el estado para eliminar un detalle de pedido específico
  const confirmDelete = (id) => {
    setDetailToDelete(id);
  };

  // Elimina el detalle seleccionado de la base de datos
  const handleDelete = async () => {
    if (detailToDelete) {
      await supabase.from('detallepedidos').delete().eq('id_detalle', detailToDelete);
      fetchOrderDetails(); // Recarga la lista de detalles tras la eliminación
      setDetailToDelete(null); // Limpia el estado de eliminación
    }
  };

  // Limpia el formulario y el estado de detalle seleccionado
  const handleClearForm = () => {
    setSelectedDetail(null);
    setForm({
      id_pedido: '',
      id_producto: '',
      cantidad: '',
      precio_unitario: ''
    });
  };

  return (
    <div className="manager-container">
      {/* Sección de la lista de detalles de pedido */}
      <div className="list-container">
        <h2>Lista de Detalles de Pedido</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>ID Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((detail) => (
              <tr key={detail.id_detalle}>
                <td>{detail.id_pedido}</td>
                <td>{detail.id_producto}</td>
                <td>{detail.cantidad}</td>
                <td>₡{detail.precio_unitario}</td>
                <td>
                  <button className="button button-edit" onClick={() => handleSelectDetail(detail)}>Editar</button>
                  <button className="button button-delete" onClick={() => confirmDelete(detail.id_detalle)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario para agregar o editar detalles de pedido */}
      <div className="form-container">
        <h2>{selectedDetail ? 'Editar Detalle de Pedido' : 'Agregar Detalle de Pedido'}</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-input" type="number" name="id_pedido" value={form.id_pedido} onChange={handleChange} placeholder="ID Pedido" required />
          <input className="form-input" type="number" name="id_producto" value={form.id_producto} onChange={handleChange} placeholder="ID Producto" required />
          <input className="form-input" type="number" name="cantidad" value={form.cantidad} onChange={handleChange} placeholder="Cantidad" required />
          <input className="form-input" type="number" name="precio_unitario" value={form.precio_unitario} onChange={handleChange} placeholder="Precio Unitario" required />
          <div className="form-actions">
            <button className="button" type="submit">{selectedDetail ? 'Actualizar' : 'Agregar'}</button>
            <button className="button button-cancel" type="button" onClick={handleClearForm}>Cancelar</button>
          </div>
        </form>
      </div>

      {/* Confirmación de eliminación de detalle de pedido */}
      {detailToDelete && (
        <div className="delete-confirmation">
          <p>¿Estás seguro de que deseas eliminar este detalle de pedido?</p>
          <button className="button button-confirm-delete" onClick={handleDelete}>Sí, eliminar</button>
          <button className="button button-cancel-delete" onClick={() => setDetailToDelete(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default OrderDetailsManager;