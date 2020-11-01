const { getAndFormatVectors } = require('../utils/utils');

exports.comparePareto = async () => {
    let vectors = await getAndFormatVectors();

    // converting it into an array for easier calculation
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
};