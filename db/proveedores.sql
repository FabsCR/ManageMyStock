CREATE TABLE Proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    nombre_proveedor VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    direccion VARCHAR(150),
    historial_pedidos TEXT
);
