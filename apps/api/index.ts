import { ApiResponse } from '@portal-edu/types'
import express from 'express'

const x: ApiResponse<string> = {
  data: 'hello',
  message: 'world',
  success: true,
  statusCode: 200,
}


const app = express()

app.get('/', (req, res) => {
  return res.json(x)
})

app.get('/health', (req, res) => {
  res.json({
    message: 'ok'
  })
})

app.listen(3000, () => {
  console.log('server is running');
  
})