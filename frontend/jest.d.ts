import "@testing-library/jest-dom";
import { expect } from "@jest/globals";

declare global {
	const test: typeof import("@jest/globals").test;
	const describe: typeof import("@jest/globals").describe;
	const expect: typeof import("@jest/globals").expect;
	namespace jest {
		interface Matchers<R> {
			toBeInTheDocument(): R;
		}
	}
}

declare module "@jest/globals" {
	interface Matchers<R> {
		toBeInTheDocument(): R;
	}
}

export {};
