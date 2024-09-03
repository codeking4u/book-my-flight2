import express from 'express'
import { getShortestRoute } from '../utils/logics.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { start, end } = req.body;
        if (!start || !end) {
            return res.status(400).send({ error: 'Start and end airport codes are required.' });
        }
        const data = await getShortestRoute(start, end);
        res.send(data);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while processing the request.' });
    }
});


router.get('/bonus', async (req, res) => {
    try {
        const { start, end } = req.body;
        if (!start || !end) {
            return res.status(400).send({ error: 'Start and end airport codes are required.' });
        }
        const data = await getShortestRoute(start, end, true);
        res.send(data);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while processing the request.' });
    }
});


export default router;