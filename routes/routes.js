import express from 'express'
import airportLookup from '../utils/logics.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const sourceCoordArr = airportLookup[req.body.start];
    const destinationCoordArr = airportLookup[req.body.end];
    res.send([sourceCoordArr, destinationCoordArr])

})


export default router;