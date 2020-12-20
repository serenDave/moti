const calculationController = require('./calculationController');
const pool = require('../dbConnection');

let queryStr;

exports.add = async (req, res, next) => {

    const { type } = req.params;

    switch (type) {
        case 'alternative':
            queryStr = 'INSERT INTO Alternative SET ?';
            break;
        case 'criterion':
            queryStr = 'INSERT INTO Сriterion SET ?';
            break;
        case 'mark':
            queryStr = 'INSERT INTO Mark SET ?';
            break;
        default:
            break;
    }

    let result;

    try {
        result = await pool.query(queryStr, req.body);  
    } catch (e) {
        console.log(e);
    }

    res.status(200).json({
        status: 'success',
        data: result
    });
};

exports.edit = async (req, res, next) => {
    
    const { type, id } = req.params;

    switch (type) {
        case 'alternative':
            queryStr = 'UPDATE Alternative SET ? WHERE idAlt = ?';
            break;
        case 'criterion':
            queryStr = 'UPDATE Сriterion SET ? WHERE idCrit = ?';
            break;
        case 'mark':
            queryStr = 'UPDATE Mark SET ? WHERE idMark = ?';
            break;
        default:
            break;
    }

    try {
        result = await pool.query(queryStr, [req.body, id]);
    } catch (e) {
        console.log(e);
    }

    res.status(200).json({
        status: 'success',
        message: result.message,
    });
};

exports.remove = async (req, res, next) => {
    
    const { type, id } = req.params;

    switch (type) {
        case 'alternative':
            queryStr = 'DELETE FROM Alternative WHERE idAlt = ?';
            break;
        case 'criterion':
            queryStr = 'DELETE FROM Сriterion WHERE idCrit = ?';
            break;
        case 'mark':
            queryStr = 'DELETE FROM Mark WHERE idMark = ?';
            break;
        default:
            break;
    }

    let result;

    try {
        result = await pool.query(queryStr, [+id]);
    } catch (e) {
        console.log(e);
    }

    res.status(200).json({
        status: 'success',
        data: result
    });
};

exports.processMainCriterion = async (req, res, next) => {
    const data = req.body;

    const { winner, additionalWinners } = await calculationController.processMainCriterion(data);

    const result = await pool.query('INSERT INTO Result SET ?', {
        idAlt: +winner.id,
        ResRange: 1
    });

    if (additionalWinners.length) {
        for (const winner of additionalWinners) {
            await pool.query('INSERT INTO Result SET ?', {
                idAlt: +winner.id,
                ResRange: 1
            });
        }
    }

    res.status(200).json({
        status: 'success',
        message: 'Alternatives calculated successfully',
        data: {
            winner,
            additionalWinners
        }
    });
}