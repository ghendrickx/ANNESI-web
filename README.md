# ANNESI-web: Artificial neural network for estuarine salt intrusion web-API
This repository contains the web-API of the open-source 
[artificial neural network for estuarine salt intrusion (ANNESI)](https://github.com/ghendrickx/ANNESI) and is part of
the same PhD research on developing nature-based solutions to mitigate salt intrusion (for more information, see the
[central repository](https://github.com/ghendrickx/SALTISolutions)).

As stated in the home-repository of [ANNESI](https://github.com/ghendrickx/ANNESI), part of this research is a 
sensitivity analysis of estuarine salt intrusion to estuarine characteristics. As a by-product of the sensitivity
analysis, a neural network has been trained to the elaborate data set created, consisting of more than 1,250 simulations 
with [Delft3D Flexible Mesh](https://www.deltares.nl/en/software/delft3d-flexible-mesh-suite/) (specifically the 
[D-Flow module](https://www.deltares.nl/en/software/module/d-flow-flexible-mesh/)).

The neural network is available as a stand-alone piece of code in `Python` for which the home-repository of 
[ANNESI](https://github.com/ghendrickx/ANNESI) should be consulted. This repository contains the `JavaScript`-code to
allow hosting this neural network as a [web-API](https://annesi-web.netlify.app/), which is hosted with `netlify`.

## Usage
The easiest way of using this web-API is by visiting the hosting website: [ANNESI-web](https://annesi-web.netlify.app/). 
Otherwise, this repository can be downloaded and the web-page can be launched locally, i.e. [`index.html`](./index.html).

## Structure
The essential pieces of code for the web-API are located in the [`src`](./src)-folder, including the data reflecting the
neural network itself, which is stored as `*.onnx`-file in the [`_data`](./src/_data)-folder:
```
+-- src/
|   +-- _data/
|   |   +-- annesi.onnx
|   |   +-- annesi-onnx.txt
|   +-- check.js
|   +-- config.js
|   +-- display.js
|   +-- exec.js
|   +-- model.js
|   +-- visuals.js
+-- .gitignore
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

Contact: [G.G.Hendrickx@tudelft.nl](mailto:G.G.Hendrickx@tudelft.nl?subject=[GitHub]%20ANNESI-web: ).

## References
When using this repository and the underlying neural network (i.e. [ANNESI](https://github.com/ghendrickx/ANNESI)), 
please consider citing the neural network software:
> Hendrickx, G.G. (2022). ANNESI: An open-source artificial neural network for estuarine salt intrusion. 
4TU.ResearchData. Software. [doi:10.4121/19307693](https://doi.org/10.4121/19307693).

### Version-control
The neural network, and so the web-API, are subject to updates. These updates are reflected by different versions of the
repository. For the latest updates on the neural network, see the original repository: 
[ANNESI](https://github.com/ghendrickx/ANNESI#version-control). Changes related to the web-API are reflected by different
versions of this repository.

## License
This repository is licensed under [`Apache License 2.0`](LICENSE).
