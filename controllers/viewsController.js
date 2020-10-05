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

    const marks = await executeQuery(
        'SELECT CName, MName, idMark, MRange, NumMark, NormMark FROM Mark INNER JOIN Сriterion ON Mark.idCrit = Сriterion.idCrit',
    );

    const critNames = await executeQuery('SELECT idCrit, CName FROM Сriterion');

    res.status(200).render('marks', {
        title: 'Marks',
        marks,
        critNames
    });
};


exports.getResults = async (req, res, next) => {

    const results = await executeQuery('SELECT * FROM Result')

    res.status(200).render('results', {
        title: 'Results',
        results
    });
};

exports.getVectors = async (req, res, next) => {

    const query = `
        SELECT A.idAlt, A.AName, C.CName, M.MName 
        FROM Alternative A, Vector V, Mark M, Сriterion C 
        WHERE A.idAlt = V.idAlt AND M.idMark = V.idMark AND C.idCrit = M.idCrit
        ORDER BY idAlt ASC;
    `;

    const results = await executeQuery(query);

    const vectors = {};

    results.forEach(result => {

        let valuesObj = { CName: result.CName, MName: result.MName };

        if (!vectors[result.idAlt]) {
            vectors[result.idAlt] = {
                name: result.AName,
                values: [valuesObj]
            };
        } else {
            vectors[result.idAlt].values.push(valuesObj);
        }
    });

    for (const vector in vectors) {
        vectors[vector].values.sort((a, b) => {
            if (a.CName < b.CName) return -1;
            if (a.CName > b.CName) return 1;
            return 0;
        });
    }

    res.status(200).render('vectors', {
        title: 'Vectors',
        vectors
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
    let addCritNames = false;

    switch (type) {
        case 'alternative':
            queryStr = 'SELECT * FROM Alternative WHERE idAlt = ?';
            break;
        case 'criterion':
            queryStr = 'SELECT * FROM Сriterion WHERE idCrit = ?';
            break;
        case 'mark':
            queryStr = `SELECT * FROM Mark M INNER JOIN Сriterion C 
                        ON M.idCrit = C.idCrit 
                        WHERE M.idMark = ?`;
            addCritNames = true;
            break;
        default:
            break;
    }

    const result = await executeQuery(queryStr, id);
    const resultObj = { type, ...result[0] };

    if (addCritNames) {
        resultObj.critNames = await executeQuery('SELECT idCrit, CName FROM Сriterion');
    }

    res.status(200).render('editView', resultObj);
};