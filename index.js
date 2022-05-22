const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

// Use Middleware

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Welcome to Dreamy Electric');
});

app.listen(port, () => {
    console.log('server is running');
})
