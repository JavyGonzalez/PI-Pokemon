const axios = require('axios');
const {Pokemon} = require('../db')
const URL = 'https://pokeapi.co/api/v2/pokemon';
const { v4: uuidv4 } = require('uuid');

const isUUID = (id) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
  };

const getPokeById = async (req, res) => {

    try {
        //Recibo en id el parametro
        const { id } = req.params;

        if (!isUUID(id)) {
            // Si no es un UUID válido, convertirlo a UUID
            const uuid = uuidv4();

        //Busca el ID en la BD
        const pokeByBd = await Pokemon.findByPk(uuid);

        if (pokeByBd) {
            return res.status(200).json(pokeByBd);
        } else {
            //Hago destructuración de los datos que necesito
            const { name, sprites, stats, height, weight } = (await axios(URL + '/' + id)).data;
            
            //Esta es la imagen del pokemon
            const {front_default} = sprites;

            //Obtengo los datos que estan dentro de stat
            let hp, attack, defense, speed;
            stats.forEach((stat) => {
                switch (stat.stat.name) {
                    case 'hp':
                        hp = stat.base_stat;
                        break;
                    case 'attack':
                        attack = stat.base_stat;
                        break;
                    case 'defense':
                        defense = stat.base_stat;
                        break;
                    case 'speed':
                        speed = stat.base_stat;
                        break;
                    default:
                        break;
                }
            });

            //Guardo el pokemon
            const pokemon = { id, name, front_default, hp, attack, defense, speed,  height, weight };

            // const crearPokeBd = await Pokemon.create(pokemon);

            return pokemon.name
                ? res.status(200).json(pokemon)
                : res.status(404).send('Pokemon no existe.')

        }
    }else{

        //Buscamos el pokemon en la base de datos por el id
        const pokeByBd = await Pokemon.findByPk(id);

        if (pokeByBd) {
          return res.status(200).json(pokeByBd);
        } else {
          return res.status(404).send('Pokemon no existe.');
        }
      
    }

    } catch (error) {
        return res.status(500).send(error.message);
    }

}

module.exports = getPokeById;