CREATE TABLE Productos (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    precio DECIMAL(10, 2) NOT NULL,
    costo DECIMAL(10, 2) NOT NULL,
    cantidad_stock INT NOT NULL,
    ubicacion_almacen VARCHAR(100),
    sku VARCHAR(50) UNIQUE NOT NULL,
    codigo_barras_qr VARCHAR(100),
    imagen_url VARCHAR(255)
);
