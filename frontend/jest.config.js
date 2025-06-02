module.exports = {
	testEnvironment: "jsdom",
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
	setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
	testMatch: ["**/__tests__/**/*.test.ts?(x)"],
	transform: {
		"^.+\\.(ts|tsx)$": "babel-jest",
	},
};
