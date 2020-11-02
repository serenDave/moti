const path = require('path');
const express = require('express');
const morgan = require('morgan');

const viewsRouter = require('./routes/viewRoutes');
const dbActionsRouter = require('./routes/dbActionsRoutes');

const { comparePareto, linearAdditionalConvolution } = require('./controllers/calculationController');

// Start new app
const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Setting templating engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Setting routes
app.use('/db', dbActionsRouter);
app.use('/', viewsRouter);

// Error catching middleware
app.all('*', (req, res, next) => {
    res.status(404).send('Cannot find such route on the server');
});

// Starting server
const port = process.env.PORT || 4000; 
const server = app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNCAUGHT REJECTION:');
    console.log(err.name, err.message);

    server.close(() => {
        connection.end();
        process.exit(1);
    });
});