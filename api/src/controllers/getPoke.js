const axios = require('axios');
const { Pokemon } = require('../db')
const URL = 'https://pokeapi.co/api/v2/pokemon';

const getPoke = async (req, res) => {
    try {

        const { name } = req.query;

        //Pregunto si hay query
        if (!name) {

            //Realizo la solicitud a la API y guardamos en response
            const response = await axios.get(URL);

            //Accedemos al results de la petición de data
            const { results } = response.data;

            // Creamos un array de promesas usando la función map. Donde cada promesa
            //es el detalle individual de cada pokemon
            const pokemonDetailsPromises = results.map(({ url }) => axios.get(url));

            //Con Promise.all esperamos que se completen todas las peticiones
            //anteriores para obtener un array
            const pokemonDetailsResponses = await Promise.all(pokemonDetailsPromises);

            //Usando la función map de polemonDetailsResponses para acceder
            //a los datos de cada respuesta y obtener un array de cada pokemon detallado
            const pokemonDetails = pokemonDetailsResponses.map(response => response.data);

            //Iteramos con map sobre el array de detealles de pokemones
            // y destructuramos las propiedades que deseamos
            const todosPoke = pokemonDetails.map(({ name, sprites, stats, height, weight }) => ({
                name,

                //Accedemos a la URL de la imagen del pokemon
                img: sprites.front_default,

                //Buscamos las estadisticas de cada pokemon y extraemos el campo base_stat
                hp: stats.find(stat => stat.stat.name === 'hp').base_stat,
                attack: stats.find(stat => stat.stat.name === 'attack').base_stat,
                defense: stats.find(stat => stat.stat.name === 'defense').base_stat,
                speed: stats.find(stat => stat.stat.name === 'speed').base_stat,
                height,
                weight,
            }));

            //Retornamos todos los pokemones con sus detalles
            return res.status(200).json(todosPoke);

        } else {

            //Guardo la respuesta a la solucitud de la API         
            const response = await axios.get(`${URL}?name=${name.toLowerCase()}`);

            //Pregunto si response
            if(response.data.results.length > 0){

                //Guardo el resultado en un arreglo de objetos que tiene el name y la URL
                const poke = response.data.results;
    
                //busco el pokemon en el arreglo y lo devuelvo
                const pokeBuscado = poke.find(pokemones => pokemones.name === name);
                
                //Pregunto si encontró el pokemon
                if(pokeBuscado){

                    res.status(200).json(pokeBuscado.name)

                }else{
                    
                    //Busco el pokemon en la base de datos
                    const pokeNameBd = await Pokemon.findOne({where: {name}});
                    if(pokeNameBd){
                        
                        //Devuelvo el nombre
                        res.status(200).json(pokeNameBd.name);
                    }else{
                        res.status(400).json('No se encontó el pokemon en la BD')
                    }
                }
            }
        }

    } catch (error) {

        console.log(error);
        return res.status(500).send(error.message)
    }
}

module.exports = getPoke;