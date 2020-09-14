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
    console.log("Output: exports.getAlternatives -> alternatives", alternatives)

    res.status(200).render('alternatives', {
        title: 'Alternatives',
        alternatives
    });
};

exports.getCriteria = async (req, res, next) => {

    const criteria = await executeQuery('SELECT * FROM Сriterion');
    console.log("Output: exports.getCriteria -> criteria", criteria)

    res.status(200).render('criteria', {
        title: 'Criteria',
        criteria
    });
};

exports.getMarks = async (req, res, next) => {

    const marks = await executeQuery('SELECT * FROM Mark');
    console.log("Output: exports.getMarks -> marks", marks)

    res.status(200).render('marks', {
        title: 'Marks',
        marks
    });
};


exports.getResults = async (req, res, next) => {

    const results = await executeQuery('SELECT * FROM Result')
    console.log("Output: exports.getResults -> results", results)

    res.status(200).render('results', {
        title: 'Results',
        results
    });
};

// exports.getAlternatives = (req, res, next) => {
//     res.status(200).render('alternatives', {
//         title: 'Alternatives'
//     });
// };

// exports.getAlternatives = (req, res, next) => {
//     res.status(200).render('alternatives', {
//         title: 'Alternatives'
//     });
// };