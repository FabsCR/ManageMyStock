CREATE TABLE Pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES Clientes(id_cliente) ON DELETE SET NULL,
    fecha_pedido DATE NOT NULL,
    estado_pedido VARCHAR(20) DEFAULT 'pendiente',
    fecha_entrega_estimada DATE
);
