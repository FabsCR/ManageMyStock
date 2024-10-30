CREATE OR REPLACE FUNCTION get_monthly_purchases()
RETURNS TABLE(month integer, total_purchases numeric) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(MONTH FROM fecha_movimiento)::integer AS month, 
        SUM(cantidad * p.costo) AS total_purchases
    FROM inventariomovimientos im
    JOIN productos p ON im.id_producto = p.id_producto
    WHERE im.tipo_movimiento = 'entrada'
    GROUP BY month
    ORDER BY month;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_inventory_detail()
RETURNS TABLE(id_producto INT, nombre_producto VARCHAR, cantidad_stock INT, ubicacion_almacen VARCHAR, categoria VARCHAR, costo DECIMAL, precio DECIMAL)
LANGUAGE SQL
AS $$
    SELECT id_producto, nombre_producto, cantidad_stock, ubicacion_almacen, categoria, costo, precio
    FROM productos;
$$;

CREATE OR REPLACE FUNCTION get_inventory_movements()
RETURNS TABLE(id_movimiento INT, id_producto INT, nombre_producto VARCHAR, fecha_movimiento DATE, tipo_movimiento VARCHAR, cantidad INT, descripcion TEXT)
LANGUAGE SQL
AS $$
    SELECT im.id_movimiento, im.id_producto, p.nombre_producto, im.fecha_movimiento, im.tipo_movimiento, im.cantidad, im.descripcion
    FROM inventariomovimientos im
    JOIN productos p ON im.id_producto = p.id_producto
    ORDER BY im.fecha_movimiento DESC;
$$;