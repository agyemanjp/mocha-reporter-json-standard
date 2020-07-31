# mocha-reporter-json-standard
Report Mocha test runner output to a standardized CI tooling output JSON format

## Description
Report Mocha test runner output to a [standardized CI tooling output JSON format](https://gist.githubusercontent.com/agyemanjp/0f43de0639a7ec872e9ebcbe6166d5d9/raw/ccb90a9298561f2ba7c07ba6843b2b25244f9cf7/code-check-general.schema.json).

This package is part of the series of packages for reporting tooling output in a standardized JSON format for use with the [ci-checks-action](https://github.com/marketplace/actions/create-github-checks-from-code-check-script-output-files) Github action. 

The other packages include:

- [eslint-formatter-json-standard](https://www.npmjs.com/package/eslint-formatter-json-standard)


## Install 
`npm install --save mocha-reporter-json-standard`

## Usage
`mocha dist/*.test.js --reporter mocha-reporter-json-standard >| test-report.json`

This will test all _*.test.js_ files in the _/dist_ folder and output the results file _test-report.json_
