const { executeQuery, getAndFormatVectors, getVotingResults } = require('../utils/utils');
const { linearAdditionalConvolution, getAbsoluteWinner, getCopelandWinner } = require('./calculationController');

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

    let vectors = await linearAdditionalConvolution();
    vectors = vectors.sort((a, b) => b.convolutionResult - a.convolutionResult);

    // for (let i = 0; i < vectors.length; i++) {
    //     const resObj = {
    //         idLPR: 1,
    //         idAlt: +vectors[i].id,
    //         ResRange: i + 1,
    //         AWeight: vectors[i].convolutionResult.toFixed(2)
    //     };

    //     const result = await executeQuery(`INSERT INTO Result SET ?`, resObj);
    //     console.log(result);
    // }

    const results = await executeQuery('SELECT idRes, idLPR, AName, ResRange, AWeight FROM Result INNER JOIN Alternative ON Result.idAlt = Alternative.idAlt' +
    ' ORDER BY ResRange ASC');

    res.status(200).render('results', {
        title: 'Results',
        results
    });
};

exports.getVectors = async (req, res, next) => {

    const vectors = await getAndFormatVectors();

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

exports.getLPRS = async (req, res, next) => {
    const LPRs = await executeQuery('SELECT * FROM LPR');

    res.status(200).render('lprs', {
        title: 'LPRs',
        LPRs
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

exports.getMainCriteriaView = async (req, res) => {
    const marks = await executeQuery(
        'SELECT * FROM Mark INNER JOIN Сriterion ON Mark.idCrit = Сriterion.idCrit'
    );

    const formattedMarks = [];

    marks.forEach((mark) => {
        const markIndex = formattedMarks.findIndex(m => m.name === mark.CName);

        if (markIndex !== -1 ) {
            if (formattedMarks[markIndex].type === 'select') {
                formattedMarks[markIndex].options.push(mark.MName);
            }
        } else {
            let markObj = {
                id: mark.idCrit,
                name: mark.CName,
                type: 'input'
            };

            if (mark.ScaleType === 'шкала порядковая' || mark.ScaleType === 'шкала наименований') {
                markObj = {
                    id: mark.idCrit,
                    name: mark.CName,
                    type: 'select',
                    select: true,
                    options: [mark.MName]
                };
            }

            formattedMarks.push(markObj);
        }
    });

    res.status(200).render('mainCriterion', {
        title: 'Choosing main criterion',
        marks: formattedMarks
    });
}

exports.getVotingResults = async (req, res) => {
    const votingResults = await getVotingResults();

    const absoluteWinner = getAbsoluteWinner(votingResults);
    const [absoluteWinnerInfo] = await executeQuery('SELECT * FROM Alternative WHERE idAlt = ?', [absoluteWinner]);
    
    const copelandWinner = getCopelandWinner(votingResults);
    const [copelandWinnerInfo] = await executeQuery('SELECT * FROM Alternative WHERE idAlt = ?', [copelandWinner]);

    res.status(200).render('votingResults', {
        title: 'Voting Results', 
        votingResults,
        absoluteWinnerInfo,
        copelandWinnerInfo
    });
};