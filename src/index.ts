/* eslint-disable fp/no-mutating-methods */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable fp/no-mutation */

import { Runner, reporters, Test, Suite } from 'mocha'
import { CheckGeneralSchema } from "./check-general"

module.exports = function (this: unknown, runner: Runner) {
	const {
		EVENT_RUN_END,
		EVENT_SUITE_END,
		EVENT_TEST_PASS,
		EVENT_TEST_FAIL
	} = Runner.constants
	reporters.Base.call(this, runner)

	const individualTests: Test[] = []
	const rootSuites: { [key: string]: Test[] } = {}

	const results: CheckGeneralSchema = {
		name: "Mocha unit tests",
		description: "Mocha unit tests",
		summary: "",
		counts: { failure: 0, warning: 0, notice: 0 },
		byFile: {},
	}
	runner.on(EVENT_SUITE_END, suite => {
		if (suite.title !== "") {
			const topMostSuite = getTopMostTitledSuite(suite)
			const existingTopSuite = rootSuites[topMostSuite.title]
			rootSuites[topMostSuite.title] = existingTopSuite !== undefined
				? [...existingTopSuite, ...suite.tests]
				: suite.tests
		}
	})

	runner.on(EVENT_TEST_PASS, function (test) {
		individualTests.push(test)
	})

	runner.on(EVENT_TEST_FAIL, function (test) {
		individualTests.push(test)
	})

	runner.on(EVENT_RUN_END, function () {
		const succesfullSuiteNames = Object.keys(rootSuites).filter(sName => rootSuites[sName].every(t => t.state === "passed"))
		const individualFailures = individualTests.filter(t => t.state !== "passed")
		results.counts.failure = individualFailures.length
		results.byFile["General"] = {
			summary: "",
			counts: { failure: individualFailures.length, warning: 0, notice: 0 },
			details: [
				...succesfullSuiteNames.map((sName, i) => ({
					Id: `success-${i}`,
					title: sName,
					message: `${rootSuites[sName].length} tests passed: ${rootSuites[sName].map(t => t.title).join(", ")}`,
					category: "notice" as CheckGeneralSchema["byFile"]["details"]["details"][0]["category"]
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

const getTopMostTitledSuite = (suite: Suite): Suite => {
	return (suite.parent === undefined || suite.parent.title === "") ? suite : getTopMostTitledSuite(suite.parent)
}