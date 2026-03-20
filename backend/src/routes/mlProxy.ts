import { Router } from 'express';
import axios from 'axios';

const router = Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

router.post('/detect', async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/api/v1/ml/detect/`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: 'ML Service detection failed', details: error.message });
    }
});

router.post('/predict', async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/api/v1/ml/predict/`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: 'ML Service prediction failed', details: error.message });
    }
});

router.post('/chat', async (req, res) => {
    try {
         const response = await axios.post(`${ML_SERVICE_URL}/api/v1/ml/chat/`, req.body);
         res.json(response.data);
    } catch (error: any) {
         res.status(500).json({ error: 'ML Service copilot chat failed', details: error.message });
    }
});

router.post('/swarm', async (req, res) => {
    try {
         const response = await axios.post(`${ML_SERVICE_URL}/api/v1/ml/swarm/`, req.body);
         res.json(response.data);
    } catch (error: any) {
         res.status(500).json({ error: 'ML Service swarm optimization failed', details: error.message });
    }
});

export default router;