// Configuration of parameters:
// name: Display title/name of parameter
// unit: Unit of parameter
// dec: Number of decimals when displaying parameter's value

// Input data configuration
const inputData = {
    'TidalRange': {
        'name': 'tidal range',
        'unit': 'm',
        'dec': 1
    },
    'SurgeLevel': {
        'name': 'surge level',
        'unit': 'm',
        'dec': 1
    },
    'RiverDischarge': {
        'name': 'river discharge',
        'unit': 'm<sup>3</sup>s<sup>-1</sup>',
        'dec': 0
    },
    'ChannelDepth': {
        'name': 'channel depth',
        'unit': 'm',
        'dec': 1
    },
    'ChannelWidth': {
        'name': 'channel width',
        'unit': 'm',
        'dec': 0
    },
    'ChannelFriction': {
        'name': 'channel friction',
        'unit': 'm<sup>1/3</sup>s<sup>-1</sup>',
        'dec': 3
    },
    'Convergence': {
        'name': 'convergence',
        'unit': 'm<sup>-1</sup>',
        'dec': 6
    },
    'FlatDepthRatio': {
        'name': 'flat depth ratio',
        'unit': '-',
        'dec': 1
    },
    'FlatWidth': {
        'name': 'flat width',
        'unit': 'm',
        'dec': 0
    },
    'FlatFriction': {
        'name': 'flat friction',
        'unit': 'm<sup>1/3</sup>s<sup>-1</sup>',
        'dec': 3
    },
    'BottomCurvature': {
        'name': 'bottom curvature',
        'unit': 'm<sup>-1</sup>',
        'dec': 6
    },
    'MeanderAmplitude': {
        'name': 'meander amplitude',
        'unit': 'm',
        'dec': 0
    },
    'MeanderLength': {
        'name': 'meander length',
        'unit': 'm',
        'dec': 0
    }
};

// Visuals data configuration
const visualsData = {
    'EstuaryLength': {
        'name': 'displayed estuary length',
        'unit': 'm',
        'dec': 0
    }
};

// Collective data configuration
const configuration = {
    'input': inputData,
    'visuals': visualsData,
    'sliders': {...inputData, ...visualsData}
};
