import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import '../App.css';

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [form, setForm] = useState({
    id_cliente: '',
    fecha_pedido: '',
    estado_pedido: 'pendiente',
    fecha_entrega_estimada: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('pedidos').select('*');
    if (!error) setOrders(data);
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setForm(order);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedOrder) {
      await supabase.from('pedidos').update(form).eq('id_pedido', selectedOrder.id_pedido);
    } else {
      await supabase.from('pedidos').insert([form]);
    }
    fetchOrders();
    handleClearForm();
  };

  const confirmDelete = (id) => {
    setOrderToDelete(id);
  };

  const handleDelete = async () => {
    if (orderToDelete) {
      await supabase.from('pedidos').delete().eq('id_pedido', orderToDelete);
      fetchOrders();
      setOrderToDelete(null);
    }
  };

  const handleClearForm = () => {
    setSelectedOrder(null);
    setForm({
      id_cliente: '',
      fecha_pedido: '',
      estado_pedido: 'pendiente',
      fecha_entrega_estimada: ''
    });
  };

  return (
    <div className="manager-container">
      <div className="list-container">
        <h2>Lista de Pedidos</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID Cliente</th>
              <th>Fecha Pedido</th>
              <th>Estado</th>
              <th>Fecha de Entrega</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id_pedido}>
                <td>{order.id_cliente}</td>
                <td>{order.fecha_pedido}</td>
                <td>{order.estado_pedido}</td>
                <td>{order.fecha_entrega_estimada}</td>
                <td>
                  <button className="button button-edit" onClick={() => handleSelectOrder(order)}>Editar</button>
                  <button className="button button-delete" onClick={() => confirmDelete(order.id_pedido)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="form-container">
        <h2>{selectedOrder ? 'Editar Pedido' : 'Agregar Pedido'}</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-input" type="number" name="id_cliente" value={form.id_cliente} onChange={handleChange} placeholder="ID Cliente" required />
          <input className="form-input" type="date" name="fecha_pedido" value={form.fecha_pedido} onChange={handleChange} placeholder="Fecha Pedido" required />
          <select className="form-input" name="estado_pedido" value={form.estado_pedido} onChange={handleChange} required>
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <input className="form-input" type="date" name="fecha_entrega_estimada" value={form.fecha_entrega_estimada} onChange={handleChange} placeholder="Fecha de Entrega" />
          <div className="form-actions">
            <button className="button" type="submit">{selectedOrder ? 'Actualizar' : 'Agregar'}</button>
            <button className="button button-cancel" type="button" onClick={handleClearForm}>Cancelar</button>
          </div>
        </form>
      </div>
      {orderToDelete && (
        <div className="delete-confirmation">
          <p>¿Estás seguro de que deseas eliminar este pedido?</p>
          <button className="button button-confirm-delete" onClick={handleDelete}>Sí, eliminar</button>
          <button className="button button-cancel-delete" onClick={() => setOrderToDelete(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default OrderManager;