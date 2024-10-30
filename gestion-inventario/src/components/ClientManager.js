// Importa React, hooks de estado y efecto, y el cliente Supabase
import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import '../App.css';

function ClientManager() {
  // Define los estados para la lista de clientes, cliente seleccionado, cliente a eliminar y el formulario
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [form, setForm] = useState({
    nombre_cliente: '',
    contacto: '',
    direccion: '',
    historial_compras: ''
  });

  // Carga los clientes al montar el componente
  useEffect(() => {
    fetchClients();
  }, []);

  // Obtiene todos los clientes desde la tabla 'clientes'
  const fetchClients = async () => {
    const { data, error } = await supabase.from('clientes').select('*');
    if (!error) setClients(data);
  };

  // Maneja la selección de un cliente para editar
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setForm(client);
  };

  // Actualiza los datos en el formulario al cambiar los valores de los campos
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envía el formulario para agregar o actualizar un cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedClient) {
      // Actualiza el cliente seleccionado en la base de datos
      await supabase.from('clientes').update(form).eq('id_cliente', selectedClient.id_cliente);
    } else {
      // Inserta un nuevo cliente en la base de datos
      await supabase.from('clientes').insert([form]);
    }
    fetchClients(); // Refresca la lista de clientes
    handleClearForm(); // Limpia el formulario
  };

  // Almacena el ID del cliente que se quiere eliminar
  const confirmDelete = (id) => {
    setClientToDelete(id);
  };

  // Elimina el cliente seleccionado de la base de datos
  const handleDelete = async () => {
    if (clientToDelete) {
      await supabase.from('clientes').delete().eq('id_cliente', clientToDelete);
      fetchClients(); // Refresca la lista de clientes
      setClientToDelete(null); // Limpia el estado de eliminación
    }
  };

  // Limpia el formulario y deselecciona el cliente
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
        {/* Muestra la tabla de clientes */}
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

      {/* Formulario para agregar o editar un cliente */}
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

      {/* Confirmación de eliminación */}
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