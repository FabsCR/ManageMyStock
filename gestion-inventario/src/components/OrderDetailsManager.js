import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import '../App.css';

function OrderDetailsManager() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailToDelete, setDetailToDelete] = useState(null);
  const [form, setForm] = useState({
    id_pedido: '',
    id_producto: '',
    cantidad: '',
    precio_unitario: ''
  });

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    const { data, error } = await supabase.from('detallepedidos').select('*');
    if (!error) setOrderDetails(data);
  };

  const handleSelectDetail = (detail) => {
    setSelectedDetail(detail);
    setForm(detail);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDetail) {
      await supabase.from('detallepedidos').update(form).eq('id_detalle', selectedDetail.id_detalle);
    } else {
      await supabase.from('detallepedidos').insert([form]);
    }
    fetchOrderDetails();
    handleClearForm();
  };

  const confirmDelete = (id) => {
    setDetailToDelete(id);
  };

  const handleDelete = async () => {
    if (detailToDelete) {
      await supabase.from('detallepedidos').delete().eq('id_detalle', detailToDelete);
      fetchOrderDetails();
      setDetailToDelete(null);
    }
  };

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