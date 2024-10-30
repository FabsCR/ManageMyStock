import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import '../App.css';

function ClientManager() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [form, setForm] = useState({
    nombre_cliente: '',
    contacto: '',
    direccion: '',
    historial_compras: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase.from('clientes').select('*');
    if (!error) setClients(data);
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setForm(client);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedClient) {
      await supabase.from('clientes').update(form).eq('id_cliente', selectedClient.id_cliente);
    } else {
      await supabase.from('clientes').insert([form]);
    }
    fetchClients();
    handleClearForm();
  };

  const confirmDelete = (id) => {
    setClientToDelete(id);
  };

  const handleDelete = async () => {
    if (clientToDelete) {
      await supabase.from('clientes').delete().eq('id_cliente', clientToDelete);
      fetchClients();
      setClientToDelete(null);
    }
  };

  const handleClearForm = () => {
    setSelectedClient(null);
    setForm({
      nombre_cliente: '',
      contacto: '',
      direccion: '',
      historial_compras: ''
    });
  };

  return (
    <div className="manager-container">
      <div className="list-container">
        <h2>Lista de Clientes</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id_cliente}>
                <td>{client.nombre_cliente}</td>
                <td>{client.contacto}</td>
                <td>{client.direccion}</td>
                <td>
                  <button className="button button-edit" onClick={() => handleSelectClient(client)}>Editar</button>
                  <button className="button button-delete" onClick={() => confirmDelete(client.id_cliente)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="form-container">
        <h2>{selectedClient ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-input" type="text" name="nombre_cliente" value={form.nombre_cliente} onChange={handleChange} placeholder="Nombre" required />
          <input className="form-input" type="text" name="contacto" value={form.contacto} onChange={handleChange} placeholder="Contacto" />
          <input className="form-input" type="text" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" />
          <textarea className="form-textarea" name="historial_compras" value={form.historial_compras} onChange={handleChange} placeholder="Historial de Compras" />
          <div className="form-actions">
            <button className="button" type="submit">{selectedClient ? 'Actualizar' : 'Agregar'}</button>
            <button className="button button-cancel" type="button" onClick={handleClearForm}>Cancelar</button>
          </div>
        </form>
      </div>
      {clientToDelete && (
        <div className="delete-confirmation">
          <p>¿Estás seguro de que deseas eliminar este cliente?</p>
          <button className="button button-confirm-delete" onClick={handleDelete}>Sí, eliminar</button>
          <button className="button button-cancel-delete" onClick={() => setClientToDelete(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default ClientManager;