import Transformer from "../models/Transformer.js";
import {faker} from "@faker-js/faker";
import express from "express";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const totalItems = await Transformer.countDocuments();
        const transformers = await Transformer.find({}).skip(skip).limit(limit);

        const totalPages = Math.ceil(totalItems / limit);

        const collection = {
            "items": transformers,
            "_links": {
                "self": {
                    "href": `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/transformers`
                },
                "collection": {
                    "href": `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/transformers`
                }
            }, pagination: {
                currentPage: page,
                currentItems: transformers.length,
                totalPages: totalPages,
                totalItems: totalItems,
                _links: {
                    first: {
                        page: 1,
                        href: `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/transformers?page=${page}&limit=${limit}`
                    },
                    last: {
                        page: totalPages,
                        href: `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/transformers?page=${totalPages}&limit=${limit}`
                    },
                    previous: page > 1 ? {
                        page: page - 1,
                        href: `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/transformers?page=${page - 1}&limit=${limit}`
                    } : null,
                    next: page < totalPages ? {
                        page: page + 1,
                        href: `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/transformers?page=${page + 1}&limit=${limit}`
                    } : null
                }
            }
        };
        res.status(200).json(collection);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.body.method === 'SEED') {
            if (req.body.reset === 1) {
                await Transformer.deleteMany({});
            }
            const amount = req.body.amount

            await Transformer.create({
                name: 'Optimus Prime',
                faction: 'Autobots',
                description: 'Valiant leader of the Autobots'
            }, {
                name: 'Megatron',
                faction: 'Decepticons',
                description: 'Cruel leader of the Decepticons'
            }, {
                name: 'Jazz',
                faction: 'Autobots',
                description: 'The stylish lieutenant of the Autobots'
            }, {
                name: 'Starscream',
                faction: 'Decepticons',
                description: 'Cowardly second in command of the Decepticons'
            }, {
                name: 'Ironhide',
                faction: 'Autobots',
                description: 'Weapons expert of the Autobots'
            }, {
                name: 'Soundwave',
                faction: 'Decepticons',
                description: 'Clever and stealty Decepticons loyalist'
            }, {
                name: 'Bumblebee',
                faction: 'Autobots',
                description: 'Young and eager Autobot scout'
            }, {
                name: 'Shockwave',
                faction: 'Decepticons',
                description: 'Icecold scientist/doctor for the Decepticons'
            }, {
                name: 'Ratchet',
                faction: 'Autobots',
                description: 'Veteran medic of the Autobots'
            }, {
                name: 'Blitzwing',
                faction: 'Decepticons',
                description: 'Agressive triple changer, eagerly serving the Decepticons'
            });

            res.json({succes: 'You did it!'});
        } else {


            const {name, faction, description} = req.body;
            await Transformer.create({
                name: name,
                faction: faction,
                description: description
            });
            res.status(201).json({succes: true});
        }
    } catch (error) {
        res.status(400).json({error: error.message});

    }

});

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.send();
});

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const transformer = await Transformer.findById(id);
        if (!transformer) {
            return res.status(404).json('Note not found!');
        }
        res.status(200).json(transformer);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const editTransformer = req.body;
        const {id} = req.params;
        const updatedTransformer = await Transformer.findByIdAndUpdate(id, editTransformer, {
            new: true,
            runValidators: true
        });
        if (!updatedTransformer) {
            return res.status(404).json('Note not found!');
        }
        res.status(200).json({succes: updatedTransformer});
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deletedTransformer = await Transformer.findByIdAndDelete(id);
        res.status(204).json();
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.send();
});

export default router;