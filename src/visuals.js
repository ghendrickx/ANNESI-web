// Add visualisations based on the input and (model) output data.

const xAnchor = 0,
    yAnchor = 0;

const relMargin = .05,
    minXMargin = 50,
    minYMargin = 20;

const relWidth = .95,
    relHeight = .95;

const relXCBar = .25,
    relYCBar = .05,
    relBarHeight = .05,
    nColorBar = 101;

// SCALING OF DATA TO SVG-SIZE
/**
 * Determine (and set) the width and height of the SVG-object based on the web-page width.
 * @returns {[Number, Number]} width and height of SVG-object: `[width, height]`
 */
function getSVGSize()
{
    const svg = d3.select('svg')
        .attr('width', .98 * document.body.clientWidth)
        .attr('height', .25 * document.body.clientWidth);
    return [svg.attr('width'), svg.attr('height')];
}

/**
 * Determine the available plot-width available for all the components 
 * to remain visible/readable.
 * @param {Number} svgWidth SVG-width
 * @returns {Number} available width for estuarine plot
 */
function mainPlotWidth(svgWidth)
{
    const xMargin = Math.max(relMargin * svgWidth, minXMargin);
    return relWidth * svgWidth - xMargin;
}

/**
 * Determine the available plot-height available for all the components 
 * to remain visible/readable.
 * @param {Number} svgHeight SVG-height
 * @returns {Number} available height for estuarine plot
 */
function mainPlotHeight(svgHeight)
{
    const yMargin = Math.max(relMargin * svgHeight, minYMargin);
    return relHeight * svgHeight - yMargin;
}

/**
 * Scale the x-coordinates from plot-values to SVG-width.
 * @param {Number} x x-value
 * @param {Number} svgWidth SVG-width
 * @param {Number} plotWidth plot-width
 * @returns {Number} scaled x-value
 */
function xScaling(x, svgWidth, plotWidth)
{
    return (svgWidth / plotWidth) * (x - xAnchor) + xAnchor;
}

/**
 * Scale the y-coordinates from plot-values to SVG-height.
 * @param {Number} y y-value
 * @param {Number} svgHeight SVG-height
 * @param {Number} plotHeight plot-height
 * @returns {Number} scaled y-value
 */
function yScaling(y, svgHeight, plotHeight)
{
    return (svgHeight / plotHeight) * (y - yAnchor) + yAnchor;
}

// SUPPORTING FUNCTIONS
/**
 * Take the mean of the x-, or y-coordinates of a cell's defining points (or nodes).
 * @param {Array} cell cell defined with points, i.e. (x,y)-coordinates
 * @param {String} axis points' axis to take the mean over; either `'x'` of `'y'`
 * @returns {Number} mean x-, or y-coordinate of the cell
 */
function mean(cell, axis)
{
    sum = 0;
    for (const p of cell) { sum += p[axis]; }
    return sum / cell.length;
}

/**
 * Create an array between the `startValue` and `stopValue`, including the `stopValue`, of a predefined size (i.e. `size`).
 * @param {Number} startValue starting value
 * @param {Number} stopValue ending value, included in array
 * @param {Number} size size of array
 * @returns {Array} linearly spaced array
 */
function linSpace(startValue, stopValue, size)
{
    let arr = [];
    const step = (stopValue - startValue) / (size - 1);
    for (let i = 0; i < size; i++) { arr.push(startValue + step * i); }
    return arr;
}

// DEFINITION OF THE THIRD DIMENSION
/**
 * Determine the water depth based on the (x,y)-coordinates (and other input parameters).
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 * @param {Number} channelDepth channel depth
 * @param {Number} flatDepth tidal flats depth
 * @param {Number} minChannelDepth minimum channel depth
 * @param {Number} channelWidth channel width
 * @param {Number} bottomCurvature channel bottom curvature
 * @param {Number} estuaryLength estuarine length
 * @returns {Number} water depth
 */
function waterDepth(x, y, channelDepth, flatDepth, minChannelDepth, channelWidth, bottomCurvature, estuaryLength)
{
    /**
     * Linear relation describing the channel depth from the mouth (`x=0`) to the upstream boundary (`x=L`).
     * @param {Number} x x-coordinate
     * @returns {Number} channel depth
     */
    function linearChannelDepth(x) 
    { 
        return (minChannelDepth - channelDepth) / estuaryLength * x + channelDepth; 
    }

    /**
     * Quadratic relation describing the deviation of the channel depth from its mean due 
     * to the channel bottom curvature in the cross-sectional direction.
     * @param {Number} y y-coordinate
     * @returns {Number} channel depth deviation
     */
    function crossSectionDepth(y) 
    { 
        return bottomCurvature * (1/12 * Math.pow(channelWidth, 2) - Math.pow(y, 2)); 
    }

    if ( y > .5 * channelWidth || y < -.5 * channelWidth ) {
        return flatDepth;
    } else {
        return linearChannelDepth(x) + crossSectionDepth(y);
    }
}

/**
 * Determine the salt concentration as if it exponentially decayed from the estuarine mouth 
 * (`salinity=30 ppt`) to the determined salt intrusion length (`s=1 ppt`).
 * @param {Number} x x-coordinate
 * @param {Number} intrusionLength salt intrusion length
 * @returns {Number} salt concentration
 */
function saltConcentration(x, intrusionLength)
{
    return 30 * Math.exp((Math.log(1/30) / intrusionLength) * x);
}

// GETTING RELEVANT DATA
/**
 * Get the parmater to visualise from HTML's dropdown-menu.
 * @returns {String} parameter to visualise
 */
function getVisualParam()
{
    // get parameter's value
    const param = document.getElementById('visualParameter').value;

    // set dropdown-button
    document.getElementById('visualParameter').innerHTML = param;

    // return parameter
    return param;
}

/**
 * Determine all essential input data for the visualisation, which include 
 * (1) the (x,y)-coordinates of the cells (i.e. paths); 
 * (2) the visualtion parameter output for the coloring; 
 * (3) (x,y)-coordinates to mark the salt intrusion length; 
 * (4) northern land-boundary; and (5) southern land-boundary.
 * @returns {[Array<Number>, Array<Number>, Array<Number>, Array<Number>, Array<Number>]} three-dimensional data to create paths: (x,y)-coordinates of cells, and visualisation parameter output for every cell; and two-dimensional data to create the salt intrusion line and land-boundaries
 */
function getData()
{
    // load relevant data
    const svgSize = getSVGSize();
    const svgWidth = svgSize[0],
        svgHeight = svgSize[1];
    const visualParam = getVisualParam();

    const tidalRange = +document.getElementById('sliderTidalRange').value,
        riverDischarge = +document.getElementById('sliderRiverDischarge').value,
        channelDepth = +document.getElementById('sliderChannelDepth').value,
        channelWidth = +document.getElementById('sliderChannelWidth').value,
        flatDepthRatio = +document.getElementById('sliderFlatDepthRatio').value,
        flatWidth = +document.getElementById('sliderFlatWidth').value,
        convergence = +document.getElementById('sliderConvergence').value,
        bottomCurvature = +document.getElementById('sliderBottomCurvature').value,
        meanderAmplitude = +document.getElementById('sliderMeanderAmplitude').value,
        meanderLength = +document.getElementById('sliderMeanderLength').value,
        saltIntrusionLength = +document.getElementById('saltIntrusionLength').value * 1e3,
        estuaryLength = +document.getElementById('sliderEstuaryLength').value;

    // analytical relations
    const totalWidth = channelWidth + flatWidth,
        minChannelWidth = 3.67 * Math.pow(3.5 * riverDischarge, .45),
        minChannelDepth = .33 * Math.pow(3.5 * riverDischarge, .35),
        flatDepth = flatDepthRatio * tidalRange,
        minTotalWidth = minChannelWidth * (1 + flatWidth / channelWidth);

    // set x,y resolutions
    let xPoints = 50, yPoints = 3;
    if ( visualParam === 'salinity' ) {
        yPoints = 3;
    } else if ( visualParam === 'bathymetry' ) {
        yPoints = 20;
    }
    if ( meanderLength > 0 && meanderAmplitude > 0 ) {
        xPoints = estuaryLength / 100;
    }

    // GRID GENERATION
    /**
     * Apply convergence-based translation of the y-coordinates.
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @returns {Number} y-coordinate (convergence applied)
     */
    function applyConvergence(x, y)
    {
        return (y - yAnchor) * (.5 * minTotalWidth + (totalWidth - .5 * minTotalWidth) * Math.exp(
            -convergence * (x - xAnchor)
        )) / totalWidth;
    }
    
    /**
     * Apply meandering-based translation of the (x,y)-coordinates.
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @returns {[Number, Number]} (x,y)-coordinates (meandering applied)
     */
    function applyMeandering(x, y)
    {
        if ( meanderLength > 0 && meanderAmplitude > 0) {
            let waveNumber = 2 * Math.PI / meanderLength;
            let angle = Math.atan(
                -meanderAmplitude * waveNumber * Math.sin(waveNumber * (x - xAnchor))
            );
            let rotation = math.multiply(math.i, math.multiply((y - yAnchor), math.exp(math.multiply(math.i, angle))));
            let y1 = rotation.im + meanderAmplitude * Math.cos(waveNumber * (x - xAnchor));
            let x1 = x + rotation.re;
            return [x1, y1];
        } else {
            return [x, y];
        }
    }
    
    /**
     * Create a data point containing three dimensions: x-, y-, and z-coordinates.
     * @param {Number} x0 x-coordinate (rectangular value)
     * @param {Number} y0 y-coordinate (rectangular value)
     * @param {String} zFunction value to be reflected in the third dimension, i.e. the z-coordinate
     * @returns {{x: Number, y: Number, z: Number|null}} object with (x,y,z)-coordinates
     */
    function createPoint(x0, y0, zFunction=null)
    {
        let zValue = null;
        if ( zFunction === 'salinity') {
            zValue = saltConcentration(x0, saltIntrusionLength);
        } else if ( zFunction === 'bathymetry' ) {
            zValue = waterDepth(x0, y0, channelDepth, flatDepth, minChannelDepth, channelWidth, bottomCurvature, 2e5);
        }
        xy = applyMeandering(x0, applyConvergence(x0, y0));
        let plotHeight = totalWidth;
        if (meanderAmplitude > 0 && meanderLength > 0) {plotHeight += 2 * meanderAmplitude;}
        return {
            x: xScaling(xy[0], mainPlotWidth(svgWidth), estuaryLength), 
            y: yScaling(xy[1], mainPlotHeight(svgHeight), plotHeight), 
            z: zValue
        };
    }

    // construct x,y-matrix
    const xArray = linSpace(0, estuaryLength, xPoints),
        yArray = linSpace(-.5 * totalWidth, .5 * totalWidth, yPoints);

    let cells = [], north = [], south = [];
    for (i = 0; i < xArray.length - 1; i++) {
        for (j = 0; j < yArray.length - 1; j++) {
            cells.push([
                createPoint(xArray[i], yArray[j], visualParam),
                createPoint(xArray[i], yArray[j + 1], visualParam),
                createPoint(xArray[i + 1], yArray[j + 1], visualParam),
                createPoint(xArray[i + 1], yArray[j], visualParam)
            ]);
            if (j === 0) {
                north.push(
                    createPoint(xArray[i], yArray[j])
                );
            } else if (j === yArray.length - 2) {
                south.push(
                    createPoint(xArray[i], yArray[j + 1])
                );
            }
        }
    }
    north.push(createPoint(xArray[xArray.length - 1], yArray[0]));
    south.push(createPoint(xArray[xArray.length - 1], yArray[yArray.length - 1]));

    // create salt intrusion length marker
    let intrusionLine = [
        createPoint(saltIntrusionLength, -.5 * totalWidth),
        createPoint(saltIntrusionLength, +.5 * totalWidth)
    ]

    // set cell-values
    let zValues = d3.range(cells.length);
    for (let i = 0; i < cells.length; i++) {
        zValues[i] = mean(cells[i], 'z');
    }

    // return data
    return [cells, zValues, intrusionLine, north, south];
}

// DYNAMIC COLOR DEFINITIONS
/**
 * Define color-scale based on the visualisation parameter.
 * @param {String} param visualisation parameter
 * @returns {d3.scaleLinear} color-scale
 */
function colorCoding(param)
{
    // default settings
    let domain = [0, 1],
        range = ['white', 'black'];

    // parameter-specific settings
    if (param === 'salinity')
    {
        domain = [0, 30];
        range = ['white', 'darkblue'];
    }
    else if (param === 'bathymetry')
    {
        domain = [-2.5, 0, 2.5, 25];
        range = ['green', 'yellow', 'lightblue', 'darkblue'];
    }
    return d3.scaleLinear()
        .domain(domain)
        .range(range);

}

/**
 * Determine the line-color based on the data index, which reflects either 
 * the salt intrusion length (index = 0), or 
 * the land boundaries of the estuary (index = 1 or 2).
 * @param {Number} index data index
 * @param {String} visualParam visualisation parameter
 * @returns {String} line-color
 */
function lineColor(index, visualParam)
{
    if (index === 0) {
        // salt intrusion length
        if (visualParam === 'salinity') {
            return 'darkblue';
        } else if (visualParam === 'bathymetry') {
            return 'white';
        }
    } else {
        // estuarine land boundaries
        return 'black';
    }
}

/**
 * Make the salt intrusion mark invisible when it exceeds the width of the SVG.
 * @param {Array<Number>} data line-data
 * @param {Number} index line-data index
 * @param {Number} svgWidth width of SVG
 * @returns {Number} line opacity
 */
function lineOpacity(data, index, svgWidth)
{
    if ((index === 0) && (data[0].x > mainPlotWidth(svgWidth))) {
        // salt intrusion length beyond SVG
        return 0;
    } else {
        return 1;
    }
}

// FIGURE AXES
/**
 * Create a linearly scaled x-axis.
 * @param {Number} length estuary length
 * @param {Number} axisWidth plotted width of the x-axis
 * @returns {d3.scaleLinear} x-axis
 */
function xAxis(length, axisWidth)
{
    return d3.scaleLinear()
        .domain([0, length])
        .range([0, axisWidth]);
}

/**
 * Create a linearly scaled y-axis.
 * @param {Number} totalWidth total width of estuary
 * @param {Number} axisHeight plotted height of the y-axis
 * @returns {d3.scaleLinear} y-axis
 */
function yAxis(totalWidth, axisHeight)
{
    return d3.scaleLinear()
        .domain([-.5 * totalWidth, +.5 * totalWidth])
        .range([0, axisHeight]);
}

/**
 * Create a linearly scaled c-axis, i.e. colour-axis.
 * @param {Array<Number>} colorDomain min. and max. value of the colour-domain
 * @param {Number} axisWidth plotted width of the c-axis
 * @returns {d3.scaleLinear} c-axis
 */
function cAxis(colorDomain, axisWidth)
{
    return d3.scaleLinear()
        .domain(colorDomain)
        .range([0, axisWidth]);
}

// CREATE VISUALS
let line = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

/**
 * Render the visuals.
 * @param {d3.group} selection visual object-selection for the estuarine plot
 * @param {d3.group} colourBar visual object-selection for the colour-bar
 * @param {Array<d3.group>} axes array of visual object-selections for the figure-axes
 * @param {Array<Array<Number>>} data data-array
 */
function renderVisuals(selection, colourBar, axes, data)
{
    // get visualisation parameter
    const visualParam = getVisualParam()
    // translate origin of visual
    const svgSize = getSVGSize();
    const svgWidth = svgSize[0],
        svgHeight = svgSize[1];

    const xMargin = Math.max(relMargin * svgWidth, minXMargin),
        yMargin = Math.max(relMargin * svgHeight, minYMargin);

    const xMove = xMargin,
        yMove = yMargin + .5 * mainPlotHeight(svgHeight);

    selection
        .attr('transform', 'translate(' + xMove + ',' + yMove + ')');
    // dynamic x- and y-axes
    const x = xAxis(
        +document.getElementById('sliderEstuaryLength').value, 
        mainPlotWidth(svgWidth)
    )
    const y = yAxis(
        +document.getElementById('sliderChannelWidth').value + 
        +document.getElementById('sliderFlatWidth').value, 
        mainPlotHeight(svgHeight)
    )

    // update color-map
    const colorScale = colorCoding(visualParam);

    // add/update color-coded patches
    const patches = selection.selectAll('path')
        .data(data[0]);
    patches
        .enter()
        .append('path')
        .attr('d', line)
        .attr('fill', function(d, i) { return colorScale(data[1][i]); })
        .attr('stroke', function(d, i) { return colorScale(data[1][i]); })
        .attr('stroke-width', 2);
    patches
        .transition()
        .attr('d', line)
        .attr('fill', function(d, i) { return colorScale(data[1][i]); })
        .attr('stroke', function(d, i) { return colorScale(data[1][i]); })
        .attr('stroke-width', 2);
    patches
        .exit()
        .remove();

    // add/update estuarine land-boundaries
    const lines = selection.selectAll('line')
        .data(data.slice(2));
    lines
        .enter()
        .append('path')
        .attr('class', line)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', function(d, i) { return lineColor(i, visualParam); })
        .style('opacity', function(d, i) { return lineOpacity(d, i, svgWidth); })
        .attr('stroke-width', 2);
    lines
        .transition()
        .attr('class', line)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', function(d, i) { return lineColor(i, visualParam); })
        .style('opacity', function(d, i) { return lineOpacity(d, i, svgWidth); })
        .attr('stroke-width', 2);
    lines
        .exit()
        .remove();

    // // add/update colour-bar
    colourBar
        .attr('transform', 'translate(' + xMove + ',' + yMove + ')');
    
    const xBar = (1 - relXCBar) * mainPlotWidth(svgWidth),
        yBar = (relYCBar - relBarHeight - .5) * mainPlotHeight(svgHeight),
        barHeight = relBarHeight * mainPlotHeight(svgHeight);

    const cDomain = colorScale.domain();
    const cData = linSpace(cDomain[0], cDomain[cDomain.length - 1], nColorBar);
    const cStep = relXCBar * mainPlotWidth(svgWidth) / nColorBar;
    const cBar = cAxis(
        [cDomain[0], cDomain[cDomain.length - 1]], 
        relXCBar * mainPlotWidth(svgWidth)
    );

    const rectangles = colourBar.selectAll('rect')
        .data(cData);
    rectangles
        .enter()
        .append('rect')
        .attr('x', function(d, i) { return xBar + i * cStep; })
        .attr('y', yBar)
        .attr('width', cStep)
        .attr('height', barHeight)
        .attr('fill', function(d) { return colorScale(d, visualParam); })
        .attr('stroke', function(d) { return colorScale(d, visualParam); });
    rectangles
        .transition()
        .attr('x', function(d, i) { return xBar + i * cStep; })
        .attr('y', yBar)
        .attr('width', cStep)
        .attr('height', barHeight)
        .attr('fill', function(d) { return colorScale(d, visualParam); })
        .attr('stroke', function(d) { return colorScale(d, visualParam); });
    rectangles
        .exit()
        .remove();

    // add/update axes
    axes[0]
        .attr('transform', 'translate(' + xMargin + ',' + .8 * yMargin + ')')
        .call(d3.axisTop(x));
    axes[1]
        .attr('transform', 'translate(' + .8 * xMargin + ',' + yMargin + ')')
        .call(d3.axisLeft(y));
    axes[2]
        .attr('transform', 'translate(' + (xMargin + xBar) + ',' + (yMove + yBar + barHeight) + ')')
        .call(
            d3.axisBottom(cBar)
                .tickValues(cDomain)
                .tickFormat(d3.format(',.1f'))
        );
}    

// initiation of object
const plot = d3.select('svg').append('g');
const cBar = d3.select('svg').append('g');
const axes = [
    d3.select('svg').append('g'),   // x-axis
    d3.select('svg').append('g'),   // y-axis
    d3.select('svg').append('g')    // c-axis
];
renderVisuals(plot, cBar, axes, getData());

/**
 * Update visualisation.
 */
function updateVisuals()
{
    renderVisuals(plot, cBar, axes, getData());
}
