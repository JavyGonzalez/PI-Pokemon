const { Router } = require('express');
const getPoke = require('../controllers/getPoke');
const getPokeById = require('../controllers/getPokeById');
const postPoke = require('../controllers/postPoke');
const getTypes = require('../controllers/getTypes');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get('/pokemons', getPoke );
router.get('/pokemons/:id', getPokeById );
router.post('/pokemons', postPoke);
router.get('/types', getTypes);



module.exports = router;
