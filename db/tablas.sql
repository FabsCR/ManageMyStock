-- Tabla 1: Proveedores
CREATE TABLE Proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    nombre_proveedor VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    direccion VARCHAR(150),
    historial_pedidos TEXT
);

-- Tabla 2: Clientes
CREATE TABLE Clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    direccion VARCHAR(150),
    historial_compras TEXT
);

-- Tabla 3: Productos
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

-- Tabla 4: Pedidos (Depende de Clientes)
CREATE TABLE Pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES Clientes(id_cliente) ON DELETE SET NULL,
    fecha_pedido DATE NOT NULL,
    estado_pedido VARCHAR(20) DEFAULT 'pendiente',
    fecha_entrega_estimada DATE
);

-- Tabla 5: DetallePedidos (Depende de Pedidos y Productos)
CREATE TABLE DetallePedidos (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES Pedidos(id_pedido) ON DELETE CASCADE,
    id_producto INT REFERENCES Productos(id_producto) ON DELETE SET NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL
);

-- Tabla 6: InventarioMovimientos (Depende de Productos)
CREATE TABLE InventarioMovimientos (
    id_movimiento SERIAL PRIMARY KEY,
    id_producto INT REFERENCES Productos(id_producto) ON DELETE CASCADE,
    fecha_movimiento DATE DEFAULT NOW(),
    tipo_movimiento VARCHAR(20) CHECK (tipo_movimiento IN ('entrada', 'salida')) NOT NULL,
    cantidad INT NOT NULL,
    descripcion TEXT
);