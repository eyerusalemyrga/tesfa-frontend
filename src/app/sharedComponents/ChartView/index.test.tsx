import { fireEvent, render, screen } from "@testing-library/react";
import ChartView from ".";

describe("ChartView", () => {
  it("can show the data as a table", () => {
    render(<ChartView chart={{ chart_type: "bar", title: "Conflicts", labels: ["Sudan", "Chad"], values: [3, 1] }} />);

    expect(screen.getByText("Conflicts")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Table" }));
    expect(screen.getByRole("cell", { name: "Sudan" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "3" })).toBeInTheDocument();
  });

  it("notes when only the largest bars are shown", () => {
    const labels = Array.from({ length: 15 }, (_, i) => `C${i}`);
    render(<ChartView chart={{ chart_type: "bar", labels, values: labels.map((_, i) => i) }} limit={12} />);
    expect(screen.getByText("Top 12 of 15")).toBeInTheDocument();
  });

  it("says when there is nothing to plot", () => {
    render(<ChartView chart={{ chart_type: "bar", labels: [], values: [] }} />);
    expect(screen.getByText("No data to show.")).toBeInTheDocument();
  });
});
