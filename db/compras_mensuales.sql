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