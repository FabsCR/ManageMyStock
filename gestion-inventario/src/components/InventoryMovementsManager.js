// Importa React, hooks de estado y efecto, y la configuración de Supabase
import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import '../App.css';

function InventoryMovementsManager() {
  // Estados para manejar movimientos de inventario, formulario, y acciones de edición y eliminación
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

  // Ejecuta fetchMovements al montar el componente para cargar los movimientos de inventario
  useEffect(() => {
    fetchMovements();
  }, []);

  // Obtiene la lista de movimientos de la base de datos desde la tabla "inventariomovimientos"
  const fetchMovements = async () => {
    const { data, error } = await supabase.from('inventariomovimientos').select('*');
    if (!error) setMovements(data);
  };

  // Selecciona un movimiento para editar, y rellena el formulario con sus datos
  const handleSelectMovement = (movement) => {
    setSelectedMovement(movement);
    setForm(movement);
  };

  // Actualiza el estado del formulario en función de los cambios realizados por el usuario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario para agregar o actualizar un movimiento
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMovement) {
      // Actualiza el movimiento existente
      await supabase.from('inventariomovimientos').update(form).eq('id_movimiento', selectedMovement.id_movimiento);
    } else {
      // Inserta un nuevo movimiento
      await supabase.from('inventariomovimientos').insert([form]);
    }
    fetchMovements(); // Recarga los movimientos para reflejar cambios
    handleClearForm(); // Limpia el formulario después de enviar
  };

  // Configura el estado para confirmar la eliminación de un movimiento específico
  const confirmDelete = (id) => {
    setMovementToDelete(id);
  };

  // Elimina el movimiento seleccionado de la base de datos
  const handleDelete = async () => {
    if (movementToDelete) {
      await supabase.from('inventariomovimientos').delete().eq('id_movimiento', movementToDelete);
      fetchMovements(); // Recarga la lista de movimientos tras la eliminación
      setMovementToDelete(null); // Limpia el estado de eliminación
    }
  };

  // Restablece el formulario y deselecciona el movimiento actual
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
      {/* Sección de lista de movimientos de inventario */}
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

      {/* Formulario para agregar o editar movimientos de inventario */}
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

      {/* Confirmación de eliminación del movimiento de inventario */}
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