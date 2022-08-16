// Loading all JavaScript modules/scripts required for the web-application, 
// i.e. running the web-application.

/**
 * Loading a `JavaScript` module/script.
 * @param {String} url URL of module/script to import
 */
function loadScript(url)
{    
    let html = document.getElementsByTagName('html')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    html.appendChild(script);
    console.log(`Script loaded: ${script.src}`);
}

// load math-module
loadScript('https://unpkg.com/mathjs@11.0.1');
// load D3-module
loadScript('https://d3js.org/d3.v7.min.js');
// load ONNX-module
loadScript('https://cdn.jsdelivr.net/npm/onnxjs/dist/onnx.min.js');
// load configuration-file
loadScript('./src/config.js');
// load display-functions
loadScript('./src/display.js');
// load input check
loadScript('./src/check.js');
// load ANNESI-model
loadScript('./src/model.js');
// load visualisations
loadScript('./src/visuals.js');
// load execution-file
loadScript('./src/exec.js');
