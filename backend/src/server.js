const app = require('./app')
const connectDb = require('./config/db')
const loadEnv = require('./utils/env')

loadEnv()

const port = process.env.PORT || 5000

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  })
