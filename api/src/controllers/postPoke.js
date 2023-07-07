const axios = require('axios');
const {Pokemon, Type} = require('../db');
const URL = 'https://pokeapi.co/api/v2/pokemon';
const {Op} = require('sequelize');

const postPoke = async (req, res) =>{
    try {

        //Hago destructuración de los datos que vienen por el Body
        const {name, img, hp, attack, defense, speed, height, weight, type } = req.body;

        //Pregunto si falta algun dato
        if(!name || ! img || !hp || !attack || !defense || !speed || !speed || !height || !weight || !type){
            return res.status(401).send('Faltan datos');
        }

        //Ver que tipo de polemon fue recibido
        const existeType = await Type.findOne({where: {name : type}});
       
        if (!existeType) { return res.status(400).json({ info: 'Seleccione un tipo de pokemón válido' }) }

        //Busco el pokemon en la base de datos
        const existePoke = await Pokemon.findOne({ where: { name: name } })

        //Si exite envío un mensaje
        if (existePoke) return res.json({ info: "Este pokemon ya existe!" });

        //Crea un nuevo pokemon en la base de datos
        const nuevoPokemon = await Pokemon.create({
            name: req.body.name,
            img:req.body.img, 
            hp: req.body.hp,
            attack: req.body.attack,
            defense: req.body.defense,
            speed: req.body.speed,
            height: req.body.height,
            weight: req.body.weight,
        });

      

         const pokeType = await Type.findAll({where: {name: {[Op.in]:type}}})
         if(!pokeType || pokeType.length === 0) return res.status(400).json({ info: 'Seleccione un tipo de pokemón válido' });

         await nuevoPokemon.addType(pokeType);

         return res.status(201).json(nuevoPokemon);

    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports = postPoke;