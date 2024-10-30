import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import '../App.css';

function InventoryMovementsManager() {
  const [movements, setMovements] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [movementToDelete, setMovementToDelete] = useState(null);
  const [form, setForm] = useState({
    id_producto: '',
    fecha_movimiento: '',
    tipo_movimiento: 'entrada',
    cantidad: '',
    descripcion: ''
  });

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    const { data, error } = await supabase.from('inventariomovimientos').select('*');
    if (!error) setMovements(data);
  };

  const handleSelectMovement = (movement) => {
    setSelectedMovement(movement);
    setForm(movement);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMovement) {
      await supabase.from('inventariomovimientos').update(form).eq('id_movimiento', selectedMovement.id_movimiento);
    } else {
      await supabase.from('inventariomovimientos').insert([form]);
    }
    fetchMovements();
    handleClearForm();
  };

  const confirmDelete = (id) => {
    setMovementToDelete(id);
  };

  const handleDelete = async () => {
    if (movementToDelete) {
      await supabase.from('inventariomovimientos').delete().eq('id_movimiento', movementToDelete);
      fetchMovements();
      setMovementToDelete(null);
    }
  };

  const handleClearForm = () => {
    setSelectedMovement(null);
    setForm({
      id_producto: '',
      fecha_movimiento: '',
      tipo_movimiento: 'entrada',
      cantidad: '',
      descripcion: ''
    });
  };

  return (
    <div className="manager-container">
      <div className="list-container">
        <h2>Lista de Movimientos de Inventario</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Fecha Movimiento</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id_movimiento}>
                <td>{movement.id_producto}</td>
                <td>{movement.fecha_movimiento}</td>
                <td>{movement.tipo_movimiento}</td>
                <td>{movement.cantidad}</td>
                <td>{movement.descripcion}</td>
                <td>
                  <button className="button button-edit" onClick={() => handleSelectMovement(movement)}>Editar</button>
                  <button className="button button-delete" onClick={() => confirmDelete(movement.id_movimiento)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="form-container">
        <h2>{selectedMovement ? 'Editar Movimiento' : 'Agregar Movimiento'}</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-input" type="number" name="id_producto" value={form.id_producto} onChange={handleChange} placeholder="ID Producto" required />
          <input className="form-input" type="date" name="fecha_movimiento" value={form.fecha_movimiento} onChange={handleChange} placeholder="Fecha Movimiento" required />
          <select className="form-input" name="tipo_movimiento" value={form.tipo_movimiento} onChange={handleChange} required>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
          <input className="form-input" type="number" name="cantidad" value={form.cantidad} onChange={handleChange} placeholder="Cantidad" required />
          <textarea className="form-textarea" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
          <div className="form-actions">
            <button className="button" type="submit">{selectedMovement ? 'Actualizar' : 'Agregar'}</button>
            <button className="button button-cancel" type="button" onClick={handleClearForm}>Cancelar</button>
          </div>
        </form>
      </div>
      {movementToDelete && (
        <div className="delete-confirmation">
          <p>¿Estás seguro de que deseas eliminar este movimiento?</p>
          <button className="button button-confirm-delete" onClick={handleDelete}>Sí, eliminar</button>
          <button className="button button-cancel-delete" onClick={() => setMovementToDelete(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default InventoryMovementsManager;