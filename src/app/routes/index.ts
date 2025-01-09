import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { ResultType } from '../../core/Types';

const app = express();
app.use(helmet());
app.use(cors());
const router = express.Router();
app.use((req, res) => {
    res.status(404);
    res.render(ResultType.ERROR, {
        param: {
            status: 404,
            message: 'not found'
        },
    });
});
module.exports = router;
