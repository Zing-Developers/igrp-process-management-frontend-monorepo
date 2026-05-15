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

describe("resolveFormDataForTask — boolean flag", () => {
  it("legacy: sem opts devolve current tal como está (mesmo vazio)", () => {
    const historyLoader = vi.fn();

    expect(
      resolveFormDataForTask(currentFormData, undefined, [], historyLoader),
    ).toBe(currentFormData);
    expect(resolveFormDataForTask([], undefined, [], historyLoader)).toEqual([]);
    expect(
      resolveFormDataForTask(undefined, undefined, [], historyLoader),
    ).toBeUndefined();

    expect(historyLoader).not.toHaveBeenCalled();
  });

  it("fallbackToHistory=false devolve current sem chamar historyLoader", () => {
    const historyLoader = vi.fn();

    expect(
      resolveFormDataForTask(
        [],
        { fallbackToHistory: false },
        [],
        historyLoader,
      ),
    ).toEqual([]);
    expect(
      resolveFormDataForTask(
        currentFormData,
        { fallbackToHistory: false },
        [],
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
      [],
      historyLoader,
    );

    expect(result).toBe(currentFormData);
    expect(historyLoader).not.toHaveBeenCalled();
  });

  it("fallbackToHistory=true + step vazio → devolve histórico", () => {
    const historyLoader = vi.fn(() => historyFormData);

    expect(
      resolveFormDataForTask(
        [],
        { fallbackToHistory: true },
        [],
        historyLoader,
      ),
    ).toBe(historyFormData);
    expect(
      resolveFormDataForTask(
        undefined,
        { fallbackToHistory: true },
        [],
        historyLoader,
      ),
    ).toBe(historyFormData);
    expect(historyLoader).toHaveBeenCalledTimes(2);
  });

  it("fallbackToHistory=true + step vazio + historyLoader devolve undefined → devolve undefined", () => {
    const historyLoader = vi.fn(() => undefined);

    const result = resolveFormDataForTask(
      [],
      { fallbackToHistory: true },
      [],
      historyLoader,
    );

    expect(result).toBeUndefined();
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });
});

describe("resolveFormDataForTask — predicate (variables) => boolean", () => {
  const decisionVars: Array<IGRPFormEntry> = [
    { name: "decision", value: "RECTIFICAR" },
    { name: "other", value: "x" },
  ];
  const aprovarVars: Array<IGRPFormEntry> = [
    { name: "decision", value: "APROVAR" },
  ];

  it("step com dados → não chama predicate e devolve current", () => {
    const predicate = vi.fn(() => true);
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      currentFormData,
      { fallbackToHistory: predicate },
      decisionVars,
      historyLoader,
    );

    expect(result).toBe(currentFormData);
    expect(predicate).not.toHaveBeenCalled();
    expect(historyLoader).not.toHaveBeenCalled();
  });

  it("step vazio + predicate(vars) === true → devolve histórico", () => {
    const predicate = vi.fn((vars: Array<IGRPFormEntry>) => {
      const d = vars.find((v) => v.name === "decision")?.value;
      return (
        typeof d === "string" &&
        ["RECTIFICAR", "RETIFICAR"].includes(d.toUpperCase())
      );
    });
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      [],
      { fallbackToHistory: predicate },
      decisionVars,
      historyLoader,
    );

    expect(result).toBe(historyFormData);
    expect(predicate).toHaveBeenCalledTimes(1);
    expect(predicate).toHaveBeenCalledWith(decisionVars);
    expect(historyLoader).toHaveBeenCalledTimes(1);
  });

  it("step vazio + predicate(vars) === false → devolve current sem chamar historyLoader", () => {
    const predicate = vi.fn(() => false);
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      [],
      { fallbackToHistory: predicate },
      aprovarVars,
      historyLoader,
    );

    expect(result).toEqual([]);
    expect(predicate).toHaveBeenCalledWith(aprovarVars);
    expect(historyLoader).not.toHaveBeenCalled();
  });

  it("step vazio + predicate recebe array vazio quando variables não disponíveis", () => {
    const predicate = vi.fn((vars: Array<IGRPFormEntry>) => vars.length > 0);
    const historyLoader = vi.fn(() => historyFormData);

    const result = resolveFormDataForTask(
      [],
      { fallbackToHistory: predicate },
      [],
      historyLoader,
    );

    expect(result).toEqual([]);
    expect(predicate).toHaveBeenCalledWith([]);
    expect(historyLoader).not.toHaveBeenCalled();
  });
});
