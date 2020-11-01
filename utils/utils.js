const pool = require('../dbConnection');

exports.executeQuery = async (queryStr, params) => {
    return pool.query(queryStr, params);
};

exports.getAndFormatVectors = async () => {
    const query = `
        SELECT A.idAlt, A.AName, C.CName, M.MName, M.NormMark 
        FROM Alternative A, Vector V, Mark M, Сriterion C 
        WHERE A.idAlt = V.idAlt AND M.idMark = V.idMark AND C.idCrit = M.idCrit
        ORDER BY idAlt ASC;
    `;

    const results = await module.exports.executeQuery(query);

    const vectors = {};

    results.forEach((result) => {
        let valuesObj = { CName: result.CName, MName: result.MName, NormMark: result.NormMark };

        if (!vectors[result.idAlt]) {
            vectors[result.idAlt] = {
                name: result.AName,
                values: [valuesObj]
            };
        } else {
            vectors[result.idAlt].values.push(valuesObj);
        }
    });

    return vectors;
};