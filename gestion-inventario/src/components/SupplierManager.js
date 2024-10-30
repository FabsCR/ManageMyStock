// Importa React y hooks necesarios: useState para manejar el estado y useEffect para la carga inicial de datos
import React, { useState, useEffect } from 'react';
// Importa la configuración de Supabase para acceder a la base de datos
import supabase from '../config/supabaseClient';
// Importa el archivo CSS de estilos para el componente
import '../App.css';

function SupplierManager() {
  // Define el estado para almacenar los proveedores
  const [suppliers, setSuppliers] = useState([]);
  // Estado para el proveedor seleccionado para editar
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  // Estado para el proveedor que se desea eliminar
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  // Estado para el formulario de creación y edición de proveedores
  const [form, setForm] = useState({
    nombre_proveedor: '',
    contacto: '',
    direccion: '',
    historial_pedidos: ''
  });

  // Carga inicial de proveedores al montar el componente
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Función para obtener todos los proveedores de la base de datos
  const fetchSuppliers = async () => {
    const { data, error } = await supabase.from('proveedores').select('*');
    if (!error) setSuppliers(data); // Si no hay error, actualiza el estado de proveedores
  };

  // Función para seleccionar un proveedor y cargar sus datos en el formulario
  const handleSelectSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setForm(supplier);
  };

  // Función para manejar los cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Función para manejar la creación o actualización de un proveedor al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSupplier) {
      // Si hay un proveedor seleccionado, actualiza sus datos
      await supabase.from('proveedores').update(form).eq('id_proveedor', selectedSupplier.id_proveedor);
    } else {
      // Si no hay proveedor seleccionado, crea uno nuevo
      await supabase.from('proveedores').insert([form]);
    }
    fetchSuppliers(); // Refresca la lista de proveedores
    handleClearForm(); // Limpia el formulario
  };

  // Función para confirmar la eliminación de un proveedor
  const confirmDelete = (id) => {
    setSupplierToDelete(id);
  };

  // Función para eliminar el proveedor confirmado
  const handleDelete = async () => {
    if (supplierToDelete) {
      await supabase.from('proveedores').delete().eq('id_proveedor', supplierToDelete);
      fetchSuppliers(); // Actualiza la lista de proveedores después de la eliminación
      setSupplierToDelete(null); // Restablece el estado de confirmación
    }
  };

  // Función para limpiar el formulario y reiniciar el estado de proveedor seleccionado
  const handleClearForm = () => {
    setSelectedSupplier(null);
    setForm({
      nombre_proveedor: '',
      contacto: '',
      direccion: '',
      historial_pedidos: ''
    });
  };

  return (
    <div className="manager-container">
      <div className="list-container">
        <h2>Lista de Proveedores</h2>
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
            {suppliers.map((supplier) => (
              <tr key={supplier.id_proveedor}>
                <td>{supplier.nombre_proveedor}</td>
                <td>{supplier.contacto}</td>
                <td>{supplier.direccion}</td>
                <td>
                  <button className="button button-edit" onClick={() => handleSelectSupplier(supplier)}>Editar</button>
                  <button className="button button-delete" onClick={() => confirmDelete(supplier.id_proveedor)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="form-container">
        <h2>{selectedSupplier ? 'Editar Proveedor' : 'Agregar Proveedor'}</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-input" type="text" name="nombre_proveedor" value={form.nombre_proveedor} onChange={handleChange} placeholder="Nombre" required />
          <input className="form-input" type="text" name="contacto" value={form.contacto} onChange={handleChange} placeholder="Contacto" />
          <input className="form-input" type="text" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" />
          <textarea className="form-textarea" name="historial_pedidos" value={form.historial_pedidos} onChange={handleChange} placeholder="Historial de Pedidos" />
          <div className="form-actions">
            <button className="button" type="submit">{selectedSupplier ? 'Actualizar' : 'Agregar'}</button>
            <button className="button button-cancel" type="button" onClick={handleClearForm}>Cancelar</button>
          </div>
        </form>
      </div>
      {supplierToDelete && (
        <div className="delete-confirmation">
          <p>¿Estás seguro de que deseas eliminar este proveedor?</p>
          <button className="button button-confirm-delete" onClick={handleDelete}>Sí, eliminar</button>
          <button className="button button-cancel-delete" onClick={() => setSupplierToDelete(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default SupplierManager;