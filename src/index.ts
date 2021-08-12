/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable fp/no-mutation */
import { default as groupBy } from "lodash.groupby"

import { Runner, reporters, Test } from 'mocha'
import { CheckGeneralSchema } from "./check-general"


interface TestFailure {
	"stack": string;
	"message": string,
	"generatedMessage": boolean,
	"name": string,
	"code": string,
	"actual": string, //json
	"expected": string, //json
	"operator": string
}


module.exports = function (this: unknown, runner: Runner) {
	reporters.Base.call(this, runner)

	/** Corresponds to a top-most describe block */
	const individualTests: Test[] = []

	const results: CheckGeneralSchema = {
		name: "Mocha unit tests",
		description: "Mocha unit tests",
		summary: "",
		counts: { failure: 0, warning: 0, notice: 0 },
		byFile: {},
	}

	function addResult(test: Mocha.Test, message: string, category: "notice" | "failure" | "warning") {
		results.counts[category] = results.counts[category]! + 1
		const filePath = test.file!
		if (results.byFile[filePath] === undefined) {
			results.byFile[filePath] = { counts: { failure: 0, warning: 0, notice: 0 }, details: [] }
		}
		const fileResult = results.byFile[filePath]!
		fileResult.counts[category] = fileResult.counts[category]! + 1
		// eslint-disable-next-line fp/no-mutation
		fileResult.details = [...fileResult.details, {
			Id: test.titlePath()[0] ?? "",
			title: test.fullTitle(),
			message,
			category
		}]
	}

	runner.on('pass', function (test) {
		addResult(test, `"${test.title}" passed`, "notice")
	})

	runner.on('fail', function (test, err: TestFailure) {
		addResult(test, `"${test.fullTitle()}" failed\nExpected:${err.expected}\nActual:${err.actual}`, "failure")
	})

	runner.on('end', function () {
		const testsByCategories = groupBy(individualTests, t => t.titlePath)
		const succesfullGroupNames = Object.keys(testsByCategories).filter(catName => testsByCategories[catName].every(t => t.isPassed))
		const individualFailures = individualTests.filter(t => t.isFailed)
		results.byFile["General"] = {
			counts: { failure: 0, warning: 0, notice: 0 },
			details: [
				...succesfullGroupNames.map((g, i) => ({
					Id: `success-${i}`,
					title: g,
					message: `${g.length} tests passed`,
					category: "passed" as CheckGeneralSchema["byFile"]["details"]["details"][0]["category"]
				})),
				...individualFailures.map((f, i) => ({
					Id: `failure-${i}`,
					title: f.title,
					message: f.err?.message || "Error",
					category: "failure" as CheckGeneralSchema["byFile"]["details"]["details"][0]["category"]
				}))
			]
		} // as CheckGeneralSchema["byFile"]

		console.log(JSON.stringify(results, null, 2))
	})
}

