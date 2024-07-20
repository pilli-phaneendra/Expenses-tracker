require('dotenv').config();
import express from 'express';
import { connect } from 'mongoose';
import { json } from 'body-parser';
import cors from 'cors';

const app = express();
app.use(json());
app.use(cors());

connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

import userRoutes from './controllers/userController';
import expenseRoutes from './controllers/expenseController';

app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
