const db = require('../db/connection');
const { QueryTypes } = require('sequelize');

class SalesWithDetail {
  constructor() {

  }

  getSales( initDate = '2021-01-01', finalDate = '2021-01-01' ) {
    /** Take care not print in window or postman, because displaying all raws can be resource intensive  */
    return db.query(`
      SELECT 
        s.Sucursal AS branch_company,
        IFNULL(c.Razon_Social, CONCAT(c.Nombre, ' ', c.Apellido_Paterno, ' ', c.Apellido_Materno)) AS client,
        pe.Clave AS delivery_point_key,
        pe.Nombre AS delivery_point,
        ru.Nombre_Ruta AS route_name,
        r.Folio AS sales_folio,
        r.Fecha AS date,
        r.Hora_Entrega AS hour,
        IF(r.Estado = 1, 'credit payment', 'cash payment') AS payment_method,
        p.Producto AS product,
        pr.Precio AS original_price,
        rd.Cantidad AS quantity,
        IF(rd.Tipo_Descuento = 0, 'discount', IF(rd.Tipo_Descuento = 1, 'over price', 'without changes')) AS type_modification,
        rd.Descuento AS modified_price,
        (IF((r.Tipo IN (1, 7, 8, 9)), IF(rd.Tipo_Descuento = 0, pr.Precio - rd.Descuento, IF(rd.Tipo_Descuento = 1, pr.Precio + rd.Descuento, pr.Precio)), 0)) * rd.Cantidad AS final_price,
        rd.Bonificacion AS bonification
      FROM Remisiones r
      INNER JOIN Clientes c
        ON c.Id_Cliente = r.Id_Cliente
      INNER JOIN Puntos_Entrega pe
        ON pe.Id_Punto_Entrega = r.Id_Punto_Entrega
      INNER JOIN Rutas_Equipos_Operadores reo
        ON reo.id_Ruta_Equipo_Operador = r.Id_Ruta_Equipo_Operador
      INNER JOIN Rutas ru
        ON ru.Id_Ruta = reo.Id_Ruta
      INNER JOIN Sucursales s
        ON s.Id_Sucursal = r.Id_Sucursal
      INNER JOIN Remisiones_Detalles rd
        ON rd.Id_Remision = r.Id_Remision
      INNER JOIN Productos p
        ON p.Id_Producto = rd.Id_Producto
      INNER JOIN Precios pr
        ON pr.Id_Precio = rd.Id_Precio_Producto
      WHERE r.BanEliminar = 0
        AND rd.BanEliminar = 0
        AND pr.Id_Sucursal = r.Id_Sucursal
        AND r.Estado <> 2
        AND r.Fecha BETWEEN :initDate AND :finalDate
      ORDER BY r.Id_Sucursal, r.Fecha, r.Id_Cliente, rd.Id_Remision_Detalle
    `, {
      replacements: {
        initDate,
        finalDate,
      },
      type: QueryTypes.RAW,
    });
  }
}

const Sales = new SalesWithDetail();

module.exports = Sales;