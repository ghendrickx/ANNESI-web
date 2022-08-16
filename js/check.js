// Performing the input check.

/**
 * Calculation of the tidal prism based on governing input parameters.
 * @param {Number} tidalRange tidal range [m]
 * @param {Number} channelDepth channel depth [m]
 * @param {Number} channelWidth channel width [m]
 * @param {Number} channelWidthMin minimal channel width [m]
 * @param {Number} channelFriction channel friction [m]
 * @param {Number} convergence convergence [m]
 * @returns {[Number, Number]} array with the tidal prism [m3] and tidal wave period [s]: `[tidalPrism, wavePeriod]`
 */
function calcTidalPrism(tidalRange, channelDepth, channelWidth, channelWidthMin, channelFriction, convergence)
{
    const estuaryLength = 2e5; // m
    const gravAcc = 9.81; // m s-2

    // tidal wave
    let velocity = 1 / (2 * Math.sqrt(2)) * Math.sqrt(gravAcc / channelDepth) * tidalRange;
    let wavePeriod = 12 * 3600;
    let waveNumber = 1 / (wavePeriod * Math.sqrt(gravAcc * channelDepth));

    // friction parameter
    let frictionParam = 8 / (3 * Math.PI) * channelFriction * velocity / channelDepth;

    // damping parameter
    let workingParam = -1 + Math.pow(.5 * convergence / waveNumber, 2);
    let dampingParam = waveNumber / Math.sqrt(2) * Math.sqrt(
        workingParam + Math.sqrt(
            Math.pow(workingParam, 2) + Math.pow(frictionParam * wavePeriod, 2)
        )
    );

    // tidal prism
    let tidalPrism = .5 * +tidalRange * (
        +channelWidthMin / dampingParam * (1 - Math.exp(-dampingParam * estuaryLength)) +
        (+channelWidth - +channelWidthMin) / (+convergence + dampingParam) * (1 - Math.exp(-(+convergence + dampingParam) * estuaryLength))
    );

    // return tidal prism and used tidal wave period
    return [tidalPrism, wavePeriod];
}

/**
 * Loads value of parameter.
 * @param {String} parameter parameter key
 * @returns {Number} parameter value
 */
function loadValue(parameter)
{
    return +document.getElementById(`slider${parameter}`).value;
}

/**
 * Append a warning message to the collection of warnings.
 * @param {Array<String>} collection collection of warnings
 * @param {String} warning warning message
 * @returns {Array<String>} updated collection of warnings
 */
function appendWarning(collection, warning)
{
    // add warning to collection
    collection.push(`WARNING! ${warning}.`);

    // log warning
    console.log(collection[collection.length - 1]);

    // return updated collection
    return collection;
}

/**
 * Perform input check on the physical soundness of the combination of input parameters.
 * @returns {Array<String>} collection of warnings
 */
function inputCheck()
{
    // load input parameter values
    const tidalRange = loadValue('TidalRange');
    const riverDischarge = loadValue('RiverDischarge');
    const channelDepth = loadValue('ChannelDepth');
    const channelWidth = loadValue('ChannelWidth');
    const channelFriction = loadValue('ChannelFriction');
    const convergence = loadValue('Convergence');
    const flatDepthRatio = loadValue('FlatDepthRatio');
    const flatWidth = loadValue('FlatWidth');
    const bottomCurvature = loadValue('BottomCurvature');
    const meanderAmplitude = loadValue('MeanderAmplitude');
    const meanderLength = loadValue('MeanderLength');

    // initiate collection of warning messages
    let collection = [];

    // check: channel depth
    let channelDepthMin = .33 * Math.pow(3.5 * riverDischarge, .35);
    if (channelDepth < channelDepthMin)
    {
        let msg = `Channel depth: ${roundValue(channelDepth, 1)} must be larger than ${roundValue(channelDepthMin, 1)} [m]`;
        appendWarning(collection, msg);
    }

    // check: channel width
    let channelWidthMin = 3.67 * Math.pow(3.5 * riverDischarge, .45);
    if (channelWidth < channelWidthMin)
    {
        let msg = `Channel width: ${roundValue(channelWidth, 0)} must be larger than ${roundValue(channelWidthMin, 0)} [m]`;
        appendWarning(collection, msg);
    }

    // check: flat depth-1
    if (flatDepthRatio < -1 || flatDepthRatio > 1)
    {
        let msg = `Flat depth ratio: ${roundValue(flatDepthRatio, 2)} must be between -1.00 and 1.00 [-]`;
        appendWarning(collection, msg);
    }

    // check: flat depth-2
    let flatDepth = .5 * flatDepthRatio * tidalRange;
    if (flatDepth > channelDepth)
    {
        let msg = `Flat depth: ${roundValue(flatDepth, 2)} must be less than ${roundValue(channelDepth)} [m]`;
        appendWarning(collection, msg);
    }

    // check: flat width
    if (flatWidth > channelWidth)
    {
        let msg = `Flat width: ${roundValue(flatWidth, 0)} must be less than ${roundValue(channelWidth, 0)} [m]`;
        appendWarning(collection, msg);
    }

    // check: bottom curvature
    let bottomCurvatureMax = .6 * channelDepth / (channelWidth * channelWidth);
    if (bottomCurvature > bottomCurvatureMax)
    {
        let msg = `Bottom curvature: ${roundValue(bottomCurvature, 6)} must be less than ${roundValue(bottomCurvatureMax, 6)} [m<sup>-1</sup>]`;
        appendWarning(collection, msg);
    }

    // check: meandering-1 (based on Leuven et al., 2018)
    let meanderAmplitudeMax = 2.5 * Math.pow(channelWidth + flatWidth, 1.1);
    if (+meanderAmplitude > meanderAmplitudeMax)
    {
        let msg = `Meander amplitude: ${roundValue(meanderAmplitude, 0)} must be less than ${roundValue(meanderAmplitudeMax, 0)} [m]`;
        appendWarning(collection, msg);
    }

    // check: meandering-2 (based on Leuven et al., 2018)
    let meanderLengthMin = 27.044 * Math.pow(meanderAmplitude, .786);
    let meanderLengthMax = 71.429 * Math.pow(meanderAmplitude, .833);
    if (meanderLength < meanderLengthMin && meanderLength > meanderLengthMax)
    {
        let msg = `Meander length: ${roundValue(meanderLength, 0)} must be between ${roundValue(meanderLengthMin, 0)} and ${roundValue(meanderLengthMax, 0)} [m]`;
        appendWarning(collection, msg);
    }

    // check: flow velocity (based on van Rijn, 2011)
    let [tidalPrism, tidalPeriod] = calcTidalPrism(
        tidalRange, channelDepth, channelWidth, channelWidthMin, channelFriction, convergence
    );
    let channelCrossSection = channelDepth * channelWidth
    let flowVelocity = riverDischarge / channelCrossSection + 2 * tidalPrism / (tidalPeriod * channelCrossSection);
    if (flowVelocity > 2)
    {
        let msg = `Flow velocity: ${roundValue(flowVelocity, 2)} must be less than 2.00 [ms<sup>-1</sup>]`;
        appendWarning(collection, msg);
    }

    // return warning messages
    return collection;
}
