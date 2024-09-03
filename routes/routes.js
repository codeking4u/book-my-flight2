import express from 'express'
import { getShortestRoute } from '../utils/logics.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { start, end } = req.body;
    const data = await getShortestRoute(start, end)
    res.send(data)

});

router.get('/bonus', async (req, res) => {
    const { start, end } = req.body;
    const data = await getShortestRoute(start, end, true)
    res.send(data)

});


export default router;