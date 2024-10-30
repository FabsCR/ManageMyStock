-- Función: get_monthly_purchases
CREATE OR REPLACE FUNCTION get_monthly_purchases()
RETURNS TABLE(month integer, total_purchases numeric) AS $$ -- Define la función para retornar un mes y total de compras
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(MONTH FROM fecha_movimiento)::integer AS month, -- Extrae el mes de cada fecha de movimiento y lo convierte a entero
        SUM(cantidad * p.costo) AS total_purchases             -- Calcula el total de compras multiplicando cantidad por costo del producto
    FROM inventariomovimientos im
    JOIN productos p ON im.id_producto = p.id_producto         -- Une movimientos de inventario con productos según id_producto
    WHERE im.tipo_movimiento = 'entrada'                       -- Filtra solo movimientos de entrada (compras)
    GROUP BY month                                             -- Agrupa los resultados por mes
    ORDER BY month;                                            -- Ordena los resultados en orden ascendente por mes
END;
$$ LANGUAGE plpgsql;                                           -- Especifica que la función usa PL/pgSQL como lenguaje

-- Función: get_inventory_detail
CREATE OR REPLACE FUNCTION get_inventory_detail()
RETURNS TABLE(id_producto INT, nombre_producto VARCHAR, cantidad_stock INT, ubicacion_almacen VARCHAR, categoria VARCHAR, costo DECIMAL, precio DECIMAL)
LANGUAGE SQL
AS $$
    SELECT id_producto, nombre_producto, cantidad_stock, ubicacion_almacen, categoria, costo, precio
    FROM productos;                                            -- Retorna todos los detalles de inventario de la tabla productos
$$;

-- Función: get_inventory_movements
CREATE OR REPLACE FUNCTION get_inventory_movements()
RETURNS TABLE(id_movimiento INT, id_producto INT, nombre_producto VARCHAR, fecha_movimiento DATE, tipo_movimiento VARCHAR, cantidad INT, descripcion TEXT)
LANGUAGE SQL
AS $$
    SELECT im.id_movimiento, im.id_producto, p.nombre_producto, im.fecha_movimiento, im.tipo_movimiento, im.cantidad, im.descripcion
    FROM inventariomovimientos im
    JOIN productos p ON im.id_producto = p.id_producto         -- Une movimientos de inventario con productos para incluir nombre de producto
    ORDER BY im.fecha_movimiento DESC;                         -- Ordena los movimientos en orden descendente por fecha
$$;