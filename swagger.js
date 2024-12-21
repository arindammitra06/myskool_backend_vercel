const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/infra/http/routes/routes.ts'
]

swaggerAutogen(outputFile, endpointsFiles)