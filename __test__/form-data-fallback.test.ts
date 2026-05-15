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
  it("legacy: sem opts devolve o current tal como está (mesmo vazio)", () => {
    const historyLoader = vi.fn();

    expect(resolveFormDataForTask(currentFormData, undefined, historyLoader)).toBe(
      currentFormData,
    );
    expect(resolveFormDataForTask([], undefined, historyLoader)).toEqual([]);
    expect(resolveFormDataForTask(undefined, undefined, historyLoader)).toBeUndefined();

    expect(historyLoader).not.toHaveBeenCalled();
  });

  it("legacy: fallbackToHistory=false devolve current sem chamar historyLoader", () => {
    const historyLoader = vi.fn();

    expect(
      resolveFormDataForTask([], { fallbackToHistory: false }, historyLoader),
    ).toEqual([]);
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

  it("fallbackToHistory=true + step vazio (array) + sem variables → devolve histórico", () => {
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      [],
      { fallbackToHistory: true },
      historyLoader,
    );

    expect(result).toBe(historyFormData);
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });

  it("fallbackToHistory=true + step undefined + sem variables → devolve histórico", () => {
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      undefined,
      { fallbackToHistory: true },
      historyLoader,
    );

    expect(result).toBe(historyFormData);
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });

  it("fallbackToHistory=true + step vazio + decision=RECTIFICAR → devolve histórico", () => {
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      [],
      {
        fallbackToHistory: true,
        variables: [
          { name: "decision", value: "RECTIFICAR" },
          { name: "other", value: "x" },
        ],
      },
      historyLoader,
    );

    expect(result).toBe(historyFormData);
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });

  it("fallbackToHistory=true + step vazio + decision=rectificar (lowercase) → devolve histórico", () => {
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      [],
      {
        fallbackToHistory: true,
        variables: [{ name: "decision", value: "rectificar" }],
      },
      historyLoader,
    );

    expect(result).toBe(historyFormData);
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });

  it("fallbackToHistory=true + step vazio + decision=RETIFICAR (grafia legacy) → devolve histórico", () => {
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      [],
      {
        fallbackToHistory: true,
        variables: [{ name: "decision", value: "RETIFICAR" }],
      },
      historyLoader,
    );

    expect(result).toBe(historyFormData);
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });

  it("fallbackToHistory=true + step vazio + decision=APROVAR → devolve current ([]) sem chamar histórico", () => {
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      [],
      {
        fallbackToHistory: true,
        variables: [{ name: "decision", value: "APROVAR" }],
      },
      historyLoader,
    );

    expect(result).toEqual([]);
    expect(historyLoader).not.toHaveBeenCalled();
  });

  it("fallbackToHistory=true + step vazio + variables sem decision → devolve current (gate fecha)", () => {
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      [],
      {
        fallbackToHistory: true,
        variables: [{ name: "outra", value: "x" }],
      },
      historyLoader,
    );

    expect(result).toEqual([]);
    expect(historyLoader).not.toHaveBeenCalled();
  });

  it("fallbackToHistory=true + step vazio + RECTIFICAR + historyLoader devolve undefined → devolve undefined", () => {
    const historyLoader = vi.fn(() => undefined);

    const result = resolveFormDataForTask(
      [],
      {
        fallbackToHistory: true,
        variables: [{ name: "decision", value: "RECTIFICAR" }],
      },
      historyLoader,
    );

    expect(result).toBeUndefined();
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });
});
