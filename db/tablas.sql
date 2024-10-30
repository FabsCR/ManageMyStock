-- Tabla 1: Proveedores
CREATE TABLE Proveedores (
    id_proveedor SERIAL PRIMARY KEY,        -- ID único y autoincremental para cada proveedor
    nombre_proveedor VARCHAR(100) NOT NULL, -- Nombre del proveedor, requerido
    contacto VARCHAR(100),                  -- Información de contacto del proveedor, opcional
    direccion VARCHAR(150),                 -- Dirección del proveedor, opcional
    historial_pedidos TEXT                  -- Historial de pedidos realizados, opcional
);

-- Tabla 2: Clientes
CREATE TABLE Clientes (
    id_cliente SERIAL PRIMARY KEY,          -- ID único y autoincremental para cada cliente
    nombre_cliente VARCHAR(100) NOT NULL,   -- Nombre del cliente, requerido
    contacto VARCHAR(100),                  -- Información de contacto del cliente, opcional
    direccion VARCHAR(150),                 -- Dirección del cliente, opcional
    historial_compras TEXT                  -- Historial de compras realizadas, opcional
);

-- Tabla 3: Productos
CREATE TABLE Productos (
    id_producto SERIAL PRIMARY KEY,         -- ID único y autoincremental para cada producto
    nombre_producto VARCHAR(100) NOT NULL,  -- Nombre del producto, requerido
    descripcion TEXT,                       -- Descripción del producto, opcional
    categoria VARCHAR(50),                  -- Categoría del producto, opcional
    precio DECIMAL(10, 2) NOT NULL,         -- Precio de venta del producto, con dos decimales, requerido
    costo DECIMAL(10, 2) NOT NULL,          -- Costo del producto, con dos decimales, requerido
    cantidad_stock INT NOT NULL,            -- Cantidad en inventario del producto, requerido
    ubicacion_almacen VARCHAR(100),         -- Ubicación del producto en el almacén, opcional
    sku VARCHAR(50) UNIQUE NOT NULL,        -- SKU único del producto, requerido
    codigo_barras_qr VARCHAR(100),          -- Código de barras o QR del producto, opcional
    imagen_url VARCHAR(255)                 -- URL de la imagen del producto, opcional
);

-- Tabla 4: Pedidos (Depende de Clientes)
CREATE TABLE Pedidos (
    id_pedido SERIAL PRIMARY KEY,                      -- ID único y autoincremental para cada pedido
    id_cliente INT REFERENCES Clientes(id_cliente) ON DELETE SET NULL, -- ID del cliente que hizo el pedido, con referencia a Clientes; se establece en NULL si se elimina el cliente
    fecha_pedido DATE NOT NULL,                        -- Fecha en la que se realizó el pedido, requerida
    estado_pedido VARCHAR(20) DEFAULT 'pendiente',     -- Estado del pedido, con valor predeterminado 'pendiente'
    fecha_entrega_estimada DATE                        -- Fecha estimada de entrega, opcional
);

-- Tabla 5: DetallePedidos (Depende de Pedidos y Productos)
CREATE TABLE DetallePedidos (
    id_detalle SERIAL PRIMARY KEY,                     -- ID único y autoincremental para cada detalle de pedido
    id_pedido INT REFERENCES Pedidos(id_pedido) ON DELETE CASCADE, -- ID del pedido asociado, con referencia a Pedidos; se elimina en cascada si se borra el pedido
    id_producto INT REFERENCES Productos(id_producto) ON DELETE SET NULL, -- ID del producto asociado, con referencia a Productos; se establece en NULL si se elimina el producto
    cantidad INT NOT NULL,                             -- Cantidad de unidades del producto en el pedido, requerida
    precio_unitario DECIMAL(10, 2) NOT NULL            -- Precio unitario del producto en el pedido, requerido
);

-- Tabla 6: InventarioMovimientos (Depende de Productos)
CREATE TABLE InventarioMovimientos (
    id_movimiento SERIAL PRIMARY KEY,                  -- ID único y autoincremental para cada movimiento de inventario
    id_producto INT REFERENCES Productos(id_producto) ON DELETE CASCADE, -- ID del producto afectado, con referencia a Productos; se elimina en cascada si se borra el producto
    fecha_movimiento DATE DEFAULT NOW(),               -- Fecha del movimiento, con valor predeterminado a la fecha actual
    tipo_movimiento VARCHAR(20) CHECK (tipo_movimiento IN ('entrada', 'salida')) NOT NULL, -- Tipo de movimiento, con restricción para permitir solo 'entrada' o 'salida', requerido
    cantidad INT NOT NULL,                             -- Cantidad afectada en el movimiento de inventario, requerida
    descripcion TEXT                                   -- Descripción del movimiento, opcional
);