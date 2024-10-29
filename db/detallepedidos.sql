CREATE TABLE DetallePedidos (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES Pedidos(id_pedido) ON DELETE CASCADE,
    id_producto INT REFERENCES Productos(id_producto) ON DELETE SET NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL
);
