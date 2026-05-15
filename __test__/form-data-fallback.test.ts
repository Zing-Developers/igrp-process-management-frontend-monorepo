import { describe, it, expect, vi } from "vitest";
import { resolveFormDataForTask } from "../packages/ui/src/lib/form-data-fallback";
import type { IGRPFormEntry } from "../packages/ui/src/types";

const currentFormData: Array<IGRPFormEntry> = [
  { name: "field_a", value: "current-value" },
];
const historyFormData: Array<IGRPFormEntry> = [
  { name: "field_a", value: "history-value" },
  { name: "field_b", value: 42 },
];

describe("resolveFormDataForTask", () => {
  it("legacy: sem opts devolve current tal como está (mesmo vazio)", () => {
    const historyLoader = vi.fn();

    expect(resolveFormDataForTask(currentFormData, undefined, historyLoader)).toBe(
      currentFormData,
    );
    expect(resolveFormDataForTask([], undefined, historyLoader)).toEqual([]);
    expect(resolveFormDataForTask(undefined, undefined, historyLoader)).toBeUndefined();

    expect(historyLoader).not.toHaveBeenCalled();
  });

  it("fallbackToHistory=false devolve current sem chamar historyLoader", () => {
    const historyLoader = vi.fn();

    expect(
      resolveFormDataForTask([], { fallbackToHistory: false }, historyLoader),
    ).toEqual([]);
    expect(
      resolveFormDataForTask(
        currentFormData,
        { fallbackToHistory: false },
        historyLoader,
      ),
    ).toBe(currentFormData);

    expect(historyLoader).not.toHaveBeenCalled();
  });

  it("fallbackToHistory=true + step com dados → devolve current (não usa histórico)", () => {
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      currentFormData,
      { fallbackToHistory: true },
      historyLoader,
    );

    expect(result).toBe(currentFormData);
    expect(historyLoader).not.toHaveBeenCalled();
  });

  it("fallbackToHistory=true + step vazio (array) → devolve histórico", () => {
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      [],
      { fallbackToHistory: true },
      historyLoader,
    );

    expect(result).toBe(historyFormData);
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });

  it("fallbackToHistory=true + step undefined → devolve histórico", () => {
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      undefined,
      { fallbackToHistory: true },
      historyLoader,
    );

    expect(result).toBe(historyFormData);
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });

  it("fallbackToHistory=true + step vazio + historyLoader devolve undefined → devolve undefined", () => {
    const historyLoader = vi.fn(() => undefined);

    const result = resolveFormDataForTask(
      [],
      { fallbackToHistory: true },
      historyLoader,
    );

    expect(result).toBeUndefined();
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });
});
