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
    console.log(req);

    res.status(200).json({
        status: 'success',
        message: 'edited successfully'
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
        case 'mark':
            queryStr = 'DELETE FROM Mark WHERE idMark = ?';
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