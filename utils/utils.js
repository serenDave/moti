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

const getPersonsVotingResults = (results) => {
    const votingResults = [];

    results.forEach((r1, i, results) => {
        if (!votingResults.some((r) => r.idLPR === r1.idLPR)) {
            let resultArray = [];

            resultArray[r1.ResRange] = r1.idAlt;
            results.forEach((r2, j) => {
                if (r2.idLPR === r1.idLPR && i !== j) {
                    resultArray[r2.ResRange] = r2.idAlt;
                }
            });
            resultArray = resultArray.slice(1);

            votingResults.push({
                idLPR: r1.idLPR,
                votingArray: resultArray
            });
        }
    });

    return votingResults;
};

const arraysAreEqual = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
};

exports.getVotingResults = async () => {
    const query = 'SELECT * FROM Result';
    const results = await module.exports.executeQuery(query);

    const query2 = 'SELECT DISTINCT idAlt FROM Result';
    const candidates = await module.exports.executeQuery(query2);

    // Create result array
    const finalVotingResults = [];
    const personsVotingResults = getPersonsVotingResults(results);

    personsVotingResults.forEach((r1, _, results) => {
        const votingResultExists = finalVotingResults.some((r) =>
            arraysAreEqual(r.votingArray, r1.votingArray)
        );

        if (!votingResultExists) {
            const votingResult = {
                count: 1,
                votingArray: r1.votingArray
            };
    
            // If something else is the same, add to array
            results.forEach((r2) => {
                if (r2.idLPR !== r1.idLPR && arraysAreEqual(r1.votingArray, r2.votingArray)) {
                    votingResult.count = votingResult.count + 1;
                }
            });
    
            finalVotingResults.push(votingResult);
        }
    });

    return { 
        candidates: candidates.map((candidate) => candidate.idAlt),
        votingResults: finalVotingResults
    };
};