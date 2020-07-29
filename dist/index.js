"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable fp/no-mutation */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha = __importStar(require("mocha"));
module.exports = function (runner) {
    mocha.reporters.Base.call(this, runner);
    const results = {
        name: "Mocha unit tests",
        description: "Mocha unit tests",
        summary: "",
        counts: { failure: 0, warning: 0, notice: 0 },
        byFile: {},
    };
    function addResult(test, message, category) {
        results.counts[category] = results.counts[category] + 1;
        const filePath = test.file;
        if (results.byFile[filePath] === undefined) {
            results.byFile[filePath] = { counts: { failure: 0, warning: 0, notice: 0 }, details: [] };
        }
        const fileResult = results.byFile[filePath];
        fileResult.counts[category] = fileResult.counts[category] + 1;
        // eslint-disable-next-line fp/no-mutation
        fileResult.details = [...fileResult.details, { Id: test.title, message, category }];
    }
    runner.on('pass', function (test) {
        addResult(test, `"${test.title}" passed`, "notice");
    });
    runner.on('fail', function (test, err) {
        addResult(test, `"${test.fullTitle()}" failed\nExpected:${err.expected}\nActual:${err.actual}`, "failure");
    });
    runner.on('end', function () {
        console.log(JSON.stringify(results, null, 2));
    });
};
//# sourceMappingURL=index.js.map