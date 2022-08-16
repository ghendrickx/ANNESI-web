// Functions for displaying output of JavaScript code to the HTML.

/**
 * Round a value to defined number of decimals.
 * @param {Number} value numeric value
 * @param {Number} decimals number of decimals
 * @returns rounded value
 */
function roundValue(value, decimals)
{
    return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals))
        .toFixed(decimals);
}

/**
 * Update the displayed label of the parameter, including its value and unit.
 * @param {String} parameter parameter key
 */
function displayParam(parameter)
{
    // round parameter's value
    let value = roundValue(
        document.getElementById(`slider${parameter}`).value, configuration.sliders[parameter].dec
    );

    // define label
    let label = `${configuration.sliders[parameter].name}: ${value} [${configuration.sliders[parameter].unit}]`;

    // set label
    document.getElementById(`label${parameter}`).innerHTML = label;
}
