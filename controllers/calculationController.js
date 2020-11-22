const { getAndFormatVectors } = require('../utils/utils');

exports.comparePareto = async () => {
    let vectors = await getAndFormatVectors();

    // converting it into an array for easier calculation
    Object.keys(vectors).forEach((id) => {
        vectors[id].id = id;
    });
    vectors = Object.values(vectors);

    for (let i = 0; i < vectors.length; i++) {
        for (let j = i + 1; j < vectors.length; j++) {
            let firstVector = vectors[i];
            let secondVector = vectors[j];
            let numberOfWorserParameters = 0;

            // for each value
            firstVector.values.forEach((value, i) => {
                // if value of a worse than value of b
                if (value.NormMark < secondVector.values[i].NormMark) {
                    numberOfWorserParameters++;
                }
            });

            // if count === values.length, alternative a is worse than b, exclude it 
            if (numberOfWorserParameters === firstVector.values.length) {
                delete vectors[i];
            }
        }
    }

    return vectors;
}

exports.linearAdditionalConvolution = async () => {
    const vectors = await module.exports.comparePareto();

    const normalizedFactors = [];

    const valuesLength = vectors[0].values.length;

    // for each criteria
    for (let i = 0; i < valuesLength; i++) {
        let sum = 0;

        // get sum of marks
        for (let j = 0; j < vectors.length; j++) {
            sum += vectors[j].values[i].NormMark;
        }

        // save it to factors
        normalizedFactors[i] = 1 / sum;
    }

    for (let i = 0; i < vectors.length; i++) {
        const vector = vectors[i];
        let sum = 0;

        for (let j = 0; j < valuesLength; j++) {
            sum += vector.values[j].NormMark * normalizedFactors[j]
        }

        vector.convolutionResult = sum;
    }

    return vectors;
};

const passMiminalCriterias = (vectors, data) => {
    return vectors.filter((vector) => {
        for (value of vector.values) {
            const selected = data[value.CName];

            if (selected.value !== 'skip' && selected.value != 0) {
                if (selected.compare === 'strict') {
                    if (value.MName !== selected.value) {
                        return false;
                    }
                } else if (selected.compare === 'min') {
                    try {
                        const intValue = parseInt(value.MName.replace(' ', ''));
                        if (intValue < parseInt(selected.value)) {
                            return false;
                        }
                    } catch (e) {}
                }
            }
        }

        return true;
    });
}

exports.processMainCriterion = async (data) => {
    let vectors = await module.exports.comparePareto();

    vectors = passMiminalCriterias(vectors, data);

    const additionalWinners = [];
    const winner = vectors.reduce((winner, vectorToCompare, index) => {
        if (index === 0) {
            return vectorToCompare;
        } 

        const criteriaIndex = vectorToCompare.values.findIndex((value) => value.CName === data.main);

        if (vectorToCompare.values[criteriaIndex].MName > winner.values[criteriaIndex].MName) {
            return vectorToCompare;
        } else if (vectorToCompare.values[criteriaIndex].MName < winner.values[criteriaIndex].MName) {
            return winner;
        } else {
            additionalWinners.push(winner);
            return vectorToCompare;
        }
    });

    return {
        winner,
        additionalWinners
    };
}