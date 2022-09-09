// Run the model, i.e. ANNESI.

/**
 * Execute neural network ANNESI: An open source Artificial Neural Network for 
 * Estuarine Salt Intrusion.
 * @returns {Promise<Number>} salt intrusion length
 */
async function runModel()
{
    // extract and normalise all input parameters
    const params = Object.keys(configuration.input).map(p => normaliseValue(p));

    // store input data as onnx.Tensor-object
    const input = new onnx.Tensor(params, 'float32', [1, params.length]);

    // initiate ONNX-session
    const session = new onnx.InferenceSession();
    await session.loadModel('./src/_data/annesi.onnx');

    // execute ANNESI
    const outputMap = await session.run([input]);
    const outputTensor = outputMap.values().next().value;

    // return output
    return 200 * outputTensor.data[0];
}

/**
 * Normalise parameter using min-max scaling. The value and its extremes (i.e. minimum and maximum) are derived from the settings of its slider.
 * @param {String} parameter parameter key
 * @returns {Number} normalised value of parameter
 */
function normaliseValue(parameter)
{
    // get parameter-object
    const param =  document.getElementById(`slider${parameter}`);

    // normalise parameter: min-max scaling
    return ((param.value - param.min) / (param.max - param.min));
}
