import { render, screen, fireEvent, act } from "@testing-library/react";
import HomePage from "@/app/page";

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("HomePage", () => {
  it("renders title", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    await act(async () => {
      render(<HomePage />);
    });
    expect(screen.getByText("📊 Number Communication Tree")).toBeInTheDocument();
  });

  it("can input start number", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    await act(async () => {
      render(<HomePage />);
    });
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "10" } });
    expect((inputs[0] as HTMLInputElement).value).toBe("10");
  });
});
