const { Client } = require('pg')

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'orangejuicebank',
})

client.connect()
  .then(() => {
    console.log('Conectado com sucesso ao PostgreSQL!')
    return client.end()
  })
  .catch((err) => {
    console.error('Erro na conexão:', err.message)
  })
