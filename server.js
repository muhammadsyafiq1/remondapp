const express = require('express');
const app = express();
const connectDB = require('./config/db');

//call connectBD
connectDB();

//initial Middleware
app.use(express.json({extended: false}));

// route index
app.get('/', (req, res) => res.json('api is works'));

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server jalan di port ${PORT}`));