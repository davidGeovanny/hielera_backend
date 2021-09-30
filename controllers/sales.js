const { response, request } = require('express');
const db = require('../db/connection');
const { QueryTypes } = require('sequelize');
// const Sales = require('../models/view-sales-with-detail');

const getSales = async ( req = request, res = response ) => {
  try {
    const [ sales, metadata ] = await db.query(`
      SELECT 
        s.Sucursal,
        IFNULL(c.Razon_Social, CONCAT(c.Nombre, ' ', c.Apellido_Paterno, ' ', c.Apellido_Materno)) AS Cliente,
        pe.Clave AS Clave_Punto_Entrega,
        pe.Nombre AS Punto_Entrega,
        ru.Nombre_Ruta,
        r.Folio AS Folio_Remision,
        DATE_FORMAT(CONCAT(r.Fecha, ' ', r.Hora_Entrega), "%d-%m-%Y %H:%i:%s") AS Fecha,
        IF(r.Estado = 1, 'Crédito' ,'Contado') AS Forma_Pago,
        r.Fact,
        p.Producto,
        pr.Precio AS Precio_Original,
        rd.Cantidad,
        IF(rd.Tipo_Descuento = 0, 'Descuento', IF(rd.Tipo_Descuento = 1, 'Sobreprecio', 'NA')) AS Tipo_Descuento,
        rd.Descuento AS Precio_Modificado,
        (IF((r.Tipo IN (1, 7, 8, 9)), IF(rd.Tipo_Descuento = 0, pr.Precio - rd.Descuento, IF(rd.Tipo_Descuento = 1, pr.Precio + rd.Descuento, pr.Precio)), 0)) * rd.Cantidad AS Precio_Final,
        IF(rd.Bonificacion = 1, 'Sí', 'No') AS Bonificacion
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
        initDate: '2021-09-01',
        finalDate: '2021-09-29',
      }
    });

    res.json({
      ok: true
    });

    // res.json({
    //   ok: true,
    //   sales
    // });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

module.exports = {
  getSales,
};