CREATE TABLE Clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    direccion VARCHAR(150),
    historial_compras TEXT
);
