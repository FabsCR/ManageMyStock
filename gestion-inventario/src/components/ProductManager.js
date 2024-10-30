import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import '../App.css';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [form, setForm] = useState({
    nombre_producto: '',
    descripcion: '',
    categoria: '',
    precio: '',
    costo: '',
    cantidad_stock: '',
    ubicacion_almacen: '',
    sku: '',
    codigo_barras_qr: '',
    imagen_url: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('productos').select('*');
    if (!error) setProducts(data);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setForm(product);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProduct) {
      await supabase.from('productos').update(form).eq('id_producto', selectedProduct.id_producto);
    } else {
      await supabase.from('productos').insert([form]);
    }
    fetchProducts();
    handleClearForm();
  };

  const confirmDelete = (id) => {
    setProductToDelete(id);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      await supabase.from('productos').delete().eq('id_producto', productToDelete);
      fetchProducts();
      setProductToDelete(null);
    }
  };

  const handleClearForm = () => {
    setSelectedProduct(null);
    setForm({
      nombre_producto: '',
      descripcion: '',
      categoria: '',
      precio: '',
      costo: '',
      cantidad_stock: '',
      ubicacion_almacen: '',
      sku: '',
      codigo_barras_qr: '',
      imagen_url: ''
    });
  };

  return (
    <div className="manager-container">
      <div className="list-container">
        <h2>Lista de Productos</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id_producto}>
                <td>{product.nombre_producto}</td>
                <td>₡{product.precio}</td>
                <td>{product.categoria}</td>
                <td>
                  <button className="button button-edit" onClick={() => handleSelectProduct(product)}>Editar</button>
                  <button className="button button-delete" onClick={() => confirmDelete(product.id_producto)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="form-container">
        <h2>{selectedProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-input" type="text" name="nombre_producto" value={form.nombre_producto} onChange={handleChange} placeholder="Nombre" required />
          <textarea className="form-textarea" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
          <input className="form-input" type="text" name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoría" />
          <input className="form-input" type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" required />
          <input className="form-input" type="number" name="costo" value={form.costo} onChange={handleChange} placeholder="Costo" required />
          <input className="form-input" type="number" name="cantidad_stock" value={form.cantidad_stock} onChange={handleChange} placeholder="Cantidad en stock" required />
          <input className="form-input" type="text" name="ubicacion_almacen" value={form.ubicacion_almacen} onChange={handleChange} placeholder="Ubicación en almacén" />
          <input className="form-input" type="text" name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" required />
          <input className="form-input" type="text" name="codigo_barras_qr" value={form.codigo_barras_qr} onChange={handleChange} placeholder="Código de Barras" />
          <input className="form-input" type="text" name="imagen_url" value={form.imagen_url} onChange={handleChange} placeholder="URL de Imagen" />
          <div className="form-actions">
            <button className="button" type="submit">{selectedProduct ? 'Actualizar' : 'Agregar'}</button>
            <button className="button button-cancel" type="button" onClick={handleClearForm}>Cancelar</button>
          </div>
        </form>
      </div>
      {productToDelete && (
        <div className="delete-confirmation">
          <p>¿Estás seguro de que deseas eliminar este producto?</p>
          <button className="button button-confirm-delete" onClick={handleDelete}>Sí, eliminar</button>
          <button className="button button-cancel-delete" onClick={() => setProductToDelete(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default ProductManager;