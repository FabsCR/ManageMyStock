CREATE TABLE InventarioMovimientos (
    id_movimiento SERIAL PRIMARY KEY,
    id_producto INT REFERENCES Productos(id_producto) ON DELETE CASCADE,
    fecha_movimiento DATE DEFAULT NOW(),
    tipo_movimiento VARCHAR(20) CHECK (tipo_movimiento IN ('entrada', 'salida')) NOT NULL,
    cantidad INT NOT NULL,
    descripcion TEXT
);
