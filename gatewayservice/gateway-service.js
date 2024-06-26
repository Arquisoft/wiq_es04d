const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')


const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const generateServiceURL = process.env.GENERATE_SERVICE_URL || 'http://localhost:8003';
const historyServiceUrl = process.env.HISTORY_SERVICE_URL || 'http://localhost:8004';

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});
app.get("/validate/:token", (req, res) => {
  axios
      .get(`${authServiceUrl}/validate/${req.params.token}`)
      .then(({ data }) => res.json(data))
      .catch((error) => res.status(error.response.status).json({ error: error.response.data.error }));
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

//API Usuarios
app.get('/user', async(req,res)=> {
  try{
    const response = await axios.get(`${userServiceUrl}/user`);

    res.status(200).json(response.data);

  } catch(error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error getting the user' });
    }
  }
});

app.post('/user', async (req, res) => {
  try {
    const response = await axios.post(`${userServiceUrl}/adduser`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error creating the user' });
    }
  }
});

app.patch('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.patch(`${userServiceUrl}/user/${id}`, req.body);
    res.status(200).json({ status: 'OK' });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error updating the user' });
    }
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${userServiceUrl}/user/${id}`, req.body);
    res.status(200).json({ status: 'OK' });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error deleting the user' });
    }
  }
});

//API Preguntas
app.get('/question', async(req,res)=> {
  try{
    // Redirige la solicitud al servicio de generación de preguntas sin enviar un cuerpo de solicitud.
    const response = await axios.get(`${generateServiceURL}/question`);

    // Devuelve la respuesta del servicio de generación de preguntas al cliente original.
    res.status(200).json(response.data);

  } catch(error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error getting the questions' });
    }
  }
});

app.get('/question/randoms', async(req,res)=> {
  try{
    // Redirige la solicitud al servicio de generación de preguntas sin enviar un cuerpo de solicitud.
    const response = await axios.get(`${generateServiceURL}/question/randoms`);

    // Devuelve la respuesta del servicio de generación de preguntas al cliente original.
    res.status(200).json(response.data);

  } catch(error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error getting the questions' });
    }
  }
});

app.post('/question', async (req, res) => {
  try {
    const response = await axios.post(`${generateServiceURL}/question`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error creating the question' });
    }
  }
});

app.patch('/question/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.patch(`${generateServiceURL}/question/${id}`, req.body);
    res.status(200).json({ status: 'OK' });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error updating the question' });
    }
  }
});

app.delete('/question/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${generateServiceURL}/question/${id}`, req.body);
    res.status(200).json({ status: 'OK' });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error deleting the question' });
    }
  }
});

//API historial
app.get('/history/:username', async (req, res) => {
  try{
    const { username } = req.params;
    const historyResponse = await axios.get(historyServiceUrl+'/gethistory/'+username);
    res.json(historyResponse.data);
  }catch(error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

//Guardar el historial
app.post('/savehistory', async (req, res) => {
  try{
    const historyResponse = await axios.post(historyServiceUrl+'/savehistory', req.body);
    res.json(historyResponse.data);
  } catch(error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

//Obtener el historial
app.get('/gethistory', async (req, res) => {
  try{
    const historyResponse = await axios.get(historyServiceUrl+'/gethistory', {
      params: { username: req.query.username }
    });
    res.json(historyResponse.data);
  }catch(error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

//Obtener el ranking
app.get('/getranking', async (req, res) => {
  try{
    const rankingResponse = await axios.get(historyServiceUrl+'/getranking');
    res.json(rankingResponse.data);
    
  }catch(error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

// Read the OpenAPI YAML file synchronously
const openapiPath='./openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});


module.exports = server
