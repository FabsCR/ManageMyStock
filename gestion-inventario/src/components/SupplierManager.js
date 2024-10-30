import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import '../App.css';

function SupplierManager() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [form, setForm] = useState({
    nombre_proveedor: '',
    contacto: '',
    direccion: '',
    historial_pedidos: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const { data, error } = await supabase.from('proveedores').select('*');
    if (!error) setSuppliers(data);
  };

  const handleSelectSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setForm(supplier);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSupplier) {
      await supabase.from('proveedores').update(form).eq('id_proveedor', selectedSupplier.id_proveedor);
    } else {
      await supabase.from('proveedores').insert([form]);
    }
    fetchSuppliers();
    handleClearForm();
  };

  const confirmDelete = (id) => {
    setSupplierToDelete(id);
  };

  const handleDelete = async () => {
    if (supplierToDelete) {
      await supabase.from('proveedores').delete().eq('id_proveedor', supplierToDelete);
      fetchSuppliers();
      setSupplierToDelete(null);
    }
  };

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