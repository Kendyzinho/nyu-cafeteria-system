const mysql = require('mysql2/promise');

async function updatePrices() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'nyu_cafeteria'
  });

  console.log('Connected to DB');

  try {
    // Multiplicar los precios del menú por 1000
    await connection.execute('UPDATE menu SET precio = precio * 1000');
    console.log('Precios del menú actualizados');

    // Multiplicar los precios de los planes por 1000
    await connection.execute('UPDATE planes_alimentacion SET precio = precio * 1000');
    console.log('Precios de los planes actualizados');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

updatePrices();
