// Execution of ANNESI and displaying its results.

/**
 * Update parameter display and model output.
 * @param {String} parameter parameter key
 */
async function updateHTML(parameter)
{
    // update parameter display
    displayParam(parameter);

    // display any warnings
    document.getElementById('warningCheck').innerHTML = inputCheck().join('<br>');
    
    // execute ANNESI
    let output = await runModel();

    // format output
    outputText = `Salt intrusion length: <font color=darkblue><b>${roundValue(output, 1)}</b></font> [km]`;
    
    // update visuals
    document.getElementById('saltIntrusionLength').value = +output;
    updateVisuals()

    // display output
    document.getElementById('saltIntrusionLength').innerHTML = outputText;
}

/**
 * Update parameter display and model output on input from HTML.
 * @param {String} parameter parameter key
 */
function updateOnInput(parameter)
{
    document.getElementById(`slider${parameter}`).oninput = function() {
        updateHTML(parameter);
    };
}

/**
 * Update visuals on resizing the window.
 * @param {String} parameter parameter key
 */
function updateOnResize(parameter)
{
    window.onresize = function() {
        updateHTML(parameter);
    }
}

/**
 * Set the visualisation parameter upon clicking on the items of the dropdown-menu;
 * and subsequently update the HTML.
 * @param {String} visualParam visualisation parameter
 */
function setVisualParam(visualParam)
{
    // extract element
    let param = document.getElementById('visualParameter');
    
    // update elements value
    param.value = visualParam;
    param.innerHTML = visualParam;

    // execute JS-functionalities: updating visuals
    exec();
}

/**
 * Execute JS-functionalities.
 */
function exec()
{
    for (let key in configuration.sliders) {
        // initiate HTML
        updateHTML(key);
        // update HTML on input
        updateOnInput(key);
        // update HTML on resize
        updateOnResize(key);
    };
}

// call execution-function
exec();
