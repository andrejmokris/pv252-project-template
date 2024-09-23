import { factorial, initFactorialUi } from "./factorial.ts";

test("factorial-5", () => {
  expect(factorial(5)).toBe(120);
});

test("factorial-minus", () => {
  const will_throw = () => {
    factorial(-1);
  };
  expect(will_throw).toThrow("Negative numbers not supported");
});

describe("initFactorialUi", () => {
  it("should update the component with the factorial value", () => {
    const mockComponent = {
      innerHTML: "",
    } as HTMLElement;

    initFactorialUi(mockComponent);

    expect(mockComponent.innerHTML).toBe(
      "Factorial value <code>5!</code> is <code>120</code>.",
    );
  });
});
