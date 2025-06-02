const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
	testEnvironment: "node",
	transform: {
		...tsJestTransformCfg,
	},
	setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
	testMatch: ["**/__tests__/**/*.test.ts"],
	verbose: true,
	forceExit: true,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};
