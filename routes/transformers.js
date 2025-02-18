import Transformer from "../models/Transformer.js";
import express from "express";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 0;
        const page = parseInt(req.query.page) || 1;
        const skip = limit > 0 ? (page - 1) * limit : 0;

        const totalItems = await Transformer.countDocuments();
        const transformers = await Transformer.find({}).skip(skip).limit(limit);

        const totalPages = limit > 0 ? Math.ceil(totalItems / limit) : 1;

        const collection = {
            "items": transformers,
            "_links": {
                "self": {
                    "href": `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/transformers`
                },
                "collection": {
                    "href": `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/transformers`
                }
            },
            pagination: {
                currentPage: limit > 0 ? page : 1,
                currentItems: transformers.length,
                totalPages: totalPages,
                totalItems: totalItems,
                _links: limit > 0 ? {
                    first: {
                        page: 1,
                        href: `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/transformers?page=1&limit=${limit}`
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
                } : null
            }
        };

        res.status(200).json(collection);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    if (req.body.method === 'SEED') {
        try {
            if (req.body.reset === 1) {
                await Transformer.deleteMany({});
            }
            const amount = req.body.amount
            for (let i = 0; i < amount; i++) {
                await Transformer.create({
                    name: 'Optimus Prime',
                    faction: 'Autobots',
                    description: 'Valiant leader of the Autobots',
                    favorite: false
                });
            }
            res.json({succes: 'You did it!'});
        }  catch (error) {
            res.status(400).json({error: error.message});

        }
    } else {
        try {
            const {name, faction, description} = req.body;
            await Transformer.create({
                name: name,
                faction: faction,
                description: description,
                favorite: false
            });
            res.status(201).json({succes: true});
        } catch (error) {
            res.status(400).json({error: error.message});

        }
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

router.patch('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {favorite} = req.body;
        const transformer = await Transformer.findByIdAndUpdate(id, {favorite: favorite}, {
            new: true,
            runValidators: true
        });
        if (!transformer) {
            return res.status(404).json('Note not found!');
        }
        res.status(200).json({succes: transformer});
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
    res.send();
});

export default router;