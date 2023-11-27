const db = require('../db/connection');
const { QueryTypes } = require('sequelize');

class DeliveryPointEmployeesData {
  constructor() { }

  getDeliveryPointEmployees() {
    /** Take care not print in window or postman, because displaying all raws can be resource intensive  */
    return db.query(`
			SELECT
					pee.Id_PuntoEntregaEncargado
				, peed.Id_Punto_Entrega AS delivery_point_key
				, TRIM(CONCAT(
							IF(e.Nombre IS NULL, '', CONCAT(e.Nombre, ' ')),
							IF(e.Paterno IS NULL, '', CONCAT(e.Paterno, ' ')),
							IF(e.Materno IS NULL, '', e.Materno)
					)) AS employee_name
				, pe.Nombre AS delivery_point_name
			FROM Puntos_Entrega_Encargados pee
			INNER JOIN Puntos_Entrega_Encargados_Detalles peed
				ON peed.Id_PuntoEntregaEncargado = pee.Id_PuntoEntregaEncargado
			INNER JOIN Puntos_Entrega pe
				ON pe.Id_Punto_Entrega = peed.Id_Punto_Entrega
			INNER JOIN Empleados e
				ON e.Id_Empleado = pee.Id_Empleado
			WHERE pee.BanEliminar = 0
				AND e.BanEliminar = 0
				AND pe.BanEliminar = 0
				AND e.Activo = 1
				AND pe.Activo = 1
		`, {
      type: QueryTypes.RAW,
    });
  }
}

const DeliveryPointEmployees = new DeliveryPointEmployeesData();

module.exports = DeliveryPointEmployees;