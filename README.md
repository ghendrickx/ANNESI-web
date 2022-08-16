# ANNESI-web: Artificial neural network for estuarine salt intrusion web-page
This repository contains the web-API of the open-source 
[artificial neural network for estuarine salt intrusion (ANNESI)](https://github.com/ghendrickx/ANNESI) and is part of
the same PhD research on developing nature-based solutions to mitigate salt intrusion (for more information, see the
[central repository](https://github.com/ghendrickx/SALTISolutions).)

As stated in the home-repository of [ANNESI](https://github.com/ghendrickx/ANNESI), part of this research is a 
sensitivity analysis of estuarine salt intrusion to estuarine characteristics. As a by-product of the sensitivity
analysis, a neural network has been trained to the elaborate data set created, consisting of 2,000 simulations with
[Delft3D Flexible Mesh](https://www.deltares.nl/en/software/delft3d-flexible-mesh-suite/) (specifically the 
[D-Flow module](https://www.deltares.nl/en/software/module/d-flow-flexible-mesh/)).

This neural network is available as a stand-alone piece of code in `Python` for which the home-repository of 
[ANNESI](https://github.com/ghendrickx/ANNESI) should be consulted. This repository contains the `JavaScript`-code to
allow hosting this neural network as a static web-page, functioning as a static web-API, which is hosted on the website
of [SALTISolutions](); the research program which this PhD research is part of.

## Usage
The easiest way of using this web-API is by visiting the hosting website of [SALTISolutions](). Otherwise, this
repository can be downloaded and the web-page can be launched, i.e. [`index.html`](./index.html).

## Structure
The essential pieces of code for the web-API are located in the [`src`](./src)-folder, and the data reflecting the
neural network itself is stored as `*.onnx`-file in the [`_data`](./_data)-folder:
```
+-- _data/
|   +-- annesi.onnx
+-- src/
|   +-- check.js
|   +-- config.js
|   +-- display.js
|   +-- exec.js
|   +-- model.js
|   +-- visuals.js
+-- index.html
+-- LICENSE
+-- main.css
+-- main.js
+-- README.md
```

## Author
Gijs G. Hendrickx 
[![alt text](https://camo.githubusercontent.com/e1ec0e2167b22db46b0a5d60525c3e4a4f879590a04c370fef77e6a7e00eb234/68747470733a2f2f696e666f2e6f726369642e6f72672f77702d636f6e74656e742f75706c6f6164732f323031392f31312f6f726369645f31367831362e706e67) 0000-0001-9523-7657](https://orcid.org/0000-0001-9523-7657)
(Delft University of Technology).

Contact: [G.G.Hendrickx@tudelft.nl](mailto:G.G.Hendrickx@tudelft.nl?subject=[GitHub]%20ANNESI-web).

## References
When using this repository, please cite accordingly:
> Hendrickx, G.G. (2022). ANNESI-web: Web-API of an open-source artificial neural network for estuarine salt intrusion
(ANNESI). 4TU.ResearchData. Software. [doi]().

### Version-control
The neural network, and so the web-API, are subject to updates. These updates are reflected by different versions of the
repository.

## License
This repository is licensed under [`Apache License 2.0`](LICENSE).
