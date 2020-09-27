const pool = require('../dbConnection');

const executeQuery = async (queryStr, params) => {
    return pool.query(queryStr, params);
};

exports.getHomepage = (req, res, next) => {
    res.status(200).render('home', {
        title: 'Homepage'
    });
};

exports.getAlternatives = async (req, res, next) => {

    const alternatives = await executeQuery('SELECT * FROM Alternative');

    res.status(200).render('alternatives', {
        title: 'Alternatives',
        alternatives
    });
};

exports.getCriteria = async (req, res, next) => {

    const criteria = await executeQuery('SELECT * FROM Сriterion');

    res.status(200).render('criteria', {
        title: 'Criteria',
        criteria
    });
};

exports.getMarks = async (req, res, next) => {

    const marks = await executeQuery('SELECT * FROM Mark');

    res.status(200).render('marks', {
        title: 'Marks',
        marks
    });
};


exports.getResults = async (req, res, next) => {

    const results = await executeQuery('SELECT * FROM Result')

    res.status(200).render('results', {
        title: 'Results',
        results
    });
};

exports.getVectors = (req, res, next) => {
    res.status(200).render('vectors', {
        title: 'Vectors'
    });
};

exports.getLPRS = (req, res, next) => {
    res.status(200).render('lprs', {
        title: 'LPRs'
    });
};

exports.getEditView = async (req, res, next) => {
    const { type, id } = req.params;

    let queryStr;

    switch (type) {
        case 'alternative':
            queryStr = 'SELECT * FROM Alternative WHERE idAlt = ?';
            break;
        case 'criterion':
            queryStr = 'SELECT * FROM Сriterion WHERE idCrit = ?';
            break;
        case 'mark':
            queryStr = 'SELECT * FROM Mark WHERE idMark = ?';
            break;
        default:
            break;
    }

    const result = await executeQuery(queryStr, id);

    res.status(200).render('editView', { type, ...result[0] });
};