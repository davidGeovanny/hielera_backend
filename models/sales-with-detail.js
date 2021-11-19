const db = require('../db/connection');
const { QueryTypes } = require('sequelize');

class SalesWithDetail {
  constructor() { }
  
  getSales( initDate = '2021-11-03', finalDate = '2021-11-03' ) {
    /** Take care not print in window or postman, because displaying all raws can be resource intensive  */
    return db.query(`
      SELECT 
        s.Sucursal AS branch_company,
        clean_spaces(IFNULL(c.Razon_Social, CONCAT(c.Nombre, ' ', c.Apellido_Paterno, ' ', c.Apellido_Materno))) AS client,
        pe.Clave AS delivery_point_key,
        pe.Nombre AS delivery_point,
        ru.Nombre_Ruta AS route_name,
        clean_spaces(CONCAT(e_operator.Nombre, ' ', e_operator.Paterno, ' ', e_operator.Materno)) AS operator,
        clean_spaces(CONCAT(e_assistant.Nombre, ' ', e_assistant.Paterno, ' ', e_assistant.Materno)) AS assistant,
        clean_spaces(CONCAT(e_helper.Nombre, ' ', e_helper.Paterno, ' ', e_helper.Materno)) AS helper,
        r.Folio AS sales_folio,
        r.Fecha AS date,
        r.Hora_Entrega AS hour,
        IF(r.Id_Forma_Pago = 1, 'cash payment', 'credit payment') AS payment_method,
        p.Producto AS product,
        tp.Tipo_Producto AS type_product,
        pr.Precio AS original_price,
        rd.Cantidad AS quantity,
        p.Cantidad_Rendimiento AS yield,
        IF(rd.Tipo_Descuento = 0, 'discount', IF(rd.Tipo_Descuento = 1, 'over price', 'without changes')) AS type_modification,
        rd.Descuento AS modified_price,
        (IF((r.Tipo IN (1, 7, 8, 9)), IF(rd.Tipo_Descuento = 0, pr.Precio - rd.Descuento, IF(rd.Tipo_Descuento = 1, pr.Precio + rd.Descuento, pr.Precio)), 0)) * rd.Cantidad AS final_price,
        rd.Bonificacion AS bonification
      FROM Remisiones r
      INNER JOIN Remisiones_Detalles rd
        ON rd.Id_Remision = r.Id_Remision
      INNER JOIN Productos p
        ON p.Id_Producto = rd.Id_Producto
      INNER JOIN Precios pr
        ON pr.Id_Precio = rd.Id_Precio_Producto
      INNER JOIN Clientes c
        ON c.Id_Cliente = r.Id_Cliente
      INNER JOIN Sucursales s
        ON s.Id_Sucursal = r.Id_Sucursal
      INNER JOIN Puntos_Entrega pe
        ON pe.Id_Punto_Entrega = r.Id_Punto_Entrega
      INNER JOIN Rutas_Equipos_Operadores reo
        ON reo.Id_Ruta_Equipo_Operador = r.Id_Ruta_Equipo_Operador
      INNER JOIN Rutas_Operadores_Detalles rod
        ON rod.Id_Ruta = reo.Id_Ruta
      INNER JOIN Rutas_Operadores ro
        ON (ro.Id_Ruta_Operador = rod.Id_Ruta_Operador AND ro.Fecha = r.Fecha AND ro.Id_Sucursal = r.Id_Sucursal)
      INNER JOIN Empleados e_operator
        ON e_operator.Id_Empleado = rod.Id_Operador
      LEFT JOIN Empleados e_assistant
        ON e_assistant.Id_Empleado = rod.Id_Ayudante
      LEFT JOIN Empleados e_helper
        ON e_helper.Id_Empleado = rod.Id_Auxiliar
      INNER JOIN Rutas ru
        ON ru.Id_Ruta = rod.Id_Ruta
      INNER JOIN Tipos_Producto tp
        ON tp.Id_Tipo_Producto = p.Id_Tipo_Producto
      WHERE r.BanEliminar = 0
        AND r.Estado <> 2
        AND r.Fecha BETWEEN :initDate AND :finalDate
        AND rd.BanEliminar = 0
        AND pr.Id_Sucursal = r.Id_Sucursal
        AND reo.BanEliminar = 0
        AND rod.BanEliminar = 0
        AND e_operator.Activo = 1
        AND e_operator.BanEliminar = 0
        AND IF(e_assistant.Id_Empleado, e_assistant.Activo = 1, TRUE)
        AND IF(e_assistant.Id_Empleado, e_assistant.BanEliminar = 0, TRUE)
        AND IF(e_helper.Id_Empleado, e_helper.Activo = 1, TRUE)
        AND IF(e_helper.Id_Empleado, e_helper.BanEliminar = 0, TRUE)
        AND ru.Nombre_Ruta NOT LIKE '%PISO%'
      ORDER BY r.Id_Sucursal, r.Fecha, r.Id_Cliente, rd.Id_Remision_Detalle
    `, {
      replacements: {
        initDate,
        finalDate,
      },
      type: QueryTypes.RAW,
    });
  }

  getSales_legacy( initDate = '2021-11-03', finalDate = '2021-11-03' ) {
    /** Take care not print in window or postman, because displaying all raws can be resource intensive  */
    return db.query(`
      SELECT 
        s.Sucursal AS branch_company,
        clean_spaces(IFNULL(c.Razon_Social, CONCAT(c.Nombre, ' ', c.Apellido_Paterno, ' ', c.Apellido_Materno))) AS client,
        pe.Clave AS delivery_point_key,
        pe.Nombre AS delivery_point,
        ru.Nombre_Ruta AS route_name,
        clean_spaces(CONCAT(e_operator.Nombre, ' ', e_operator.Paterno, ' ', e_operator.Materno)) AS operator,
        clean_spaces(CONCAT(e_assistant.Nombre, ' ', e_assistant.Paterno, ' ', e_assistant.Materno)) AS assistant,
        clean_spaces(CONCAT(e_helper.Nombre, ' ', e_helper.Paterno, ' ', e_helper.Materno)) AS helper,
        r.Folio AS sales_folio,
        r.Fecha AS date,
        r.Hora_Entrega AS hour,
        IF(r.Id_Forma_Pago = 1, 'cash payment', 'credit payment') AS payment_method,
        p.Producto AS product,
        tp.Tipo_Producto AS type_product,
        pr.Precio AS original_price,
        rd.Cantidad AS quantity,
        p.Cantidad_Rendimiento AS yield,
        IF(rd.Tipo_Descuento = 0, 'discount', IF(rd.Tipo_Descuento = 1, 'over price', 'without changes')) AS type_modification,
        rd.Descuento AS modified_price,
        (IF((r.Tipo IN (1, 7, 8, 9)), IF(rd.Tipo_Descuento = 0, pr.Precio - rd.Descuento, IF(rd.Tipo_Descuento = 1, pr.Precio + rd.Descuento, pr.Precio)), 0)) * rd.Cantidad AS final_price,
        rd.Bonificacion AS bonification
      FROM Remisiones r
      INNER JOIN Remisiones_Detalles rd
        ON rd.Id_Remision = r.Id_Remision
      INNER JOIN Productos p
        ON p.Id_Producto = rd.Id_Producto
      INNER JOIN Precios pr
        ON pr.Id_Precio = rd.Id_Precio_Producto
      INNER JOIN Clientes c
        ON c.Id_Cliente = r.Id_Cliente
      INNER JOIN Sucursales s
        ON s.Id_Sucursal = r.Id_Sucursal
      INNER JOIN Puntos_Entrega pe
        ON pe.Id_Punto_Entrega = r.Id_Punto_Entrega
      INNER JOIN Rutas_Equipos_Operadores reo
        ON reo.Id_Ruta_Equipo_Operador = r.Id_Ruta_Equipo_Operador
      INNER JOIN Rutas_Operadores ro
        ON ro.Id_Ruta_Operador = reo.Id_Ruta_Operador
      INNER JOIN Rutas_Operadores_Detalles rod
        ON (rod.Id_Ruta_Operador = ro.Id_Ruta_Operador AND rod.Id_Ruta = reo.Id_Ruta)
      INNER JOIN Empleados e_operator
        ON e_operator.Id_Empleado = rod.Id_Operador
      LEFT JOIN Empleados e_assistant
        ON e_assistant.Id_Empleado = rod.Id_Ayudante
      LEFT JOIN Empleados e_helper
        ON e_helper.Id_Empleado = rod.Id_Auxiliar
      INNER JOIN Rutas ru
        ON ru.Id_Ruta = rod.Id_Ruta
      INNER JOIN Tipos_Producto tp
        ON tp.Id_Tipo_Producto = p.Id_Tipo_Producto
      WHERE r.BanEliminar = 0
        AND r.Estado <> 2
        AND r.Fecha BETWEEN :initDate AND :finalDate
        AND rd.BanEliminar = 0
        AND pr.Id_Sucursal = r.Id_Sucursal
        AND reo.BanEliminar = 0
        AND rod.BanEliminar = 0
        AND e_operator.Activo = 1
        AND e_operator.BanEliminar = 0
        AND IF(e_assistant.Id_Empleado, e_assistant.Activo = 1, TRUE)
        AND IF(e_assistant.Id_Empleado, e_assistant.BanEliminar = 0, TRUE)
        AND IF(e_helper.Id_Empleado, e_helper.Activo = 1, TRUE)
        AND IF(e_helper.Id_Empleado, e_helper.BanEliminar = 0, TRUE)
        AND ru.Nombre_Ruta NOT LIKE '%PISO%'
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