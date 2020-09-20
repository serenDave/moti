const { query } = require('../dbConnection');
const pool = require('../dbConnection');

let queryStr;

exports.add = async (req, res, next) => {

    const { type } = req.params;

    switch (type) {
        case 'alternative':
            queryStr = 'INSERT INTO Alternative (AName) VALUES (?)';
            break;
        default:
            break;
    }

    const result = await pool.query(queryStr, [req.body.name]);  

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
        default:
            break;
    }

    const result = pool.query(queryStr, [id]);

    res.status(200).json({
        status: 'success',
        data: result
    });
};