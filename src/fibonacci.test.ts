import { fibonacci, initFibonacciUi } from "./fibonacci.ts";

test("fibonacci-5", () => {
  expect(fibonacci(5)).toBe(5);
});

test("fibonacci-nagative", () => {
  const will_throw = () => {
    fibonacci(-1);
  };
  expect(will_throw).toThrow("Cannot compute on negative numbers");
});

describe("initFactorialUi", () => {
  it("should update the component with the factorial value", () => {
    const mockComponent = {
      innerHTML: "",
    } as HTMLElement;

    initFibonacciUi(mockComponent);

    expect(mockComponent.innerHTML).toBe(
      "5th fibonacci number is <code>5</code>",
    );
  });
});
