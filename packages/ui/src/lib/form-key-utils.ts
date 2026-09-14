/**
 * Form key formats:
 *
 * Shared (including default): ui:shared:<page>@<version>
 * Examples: ui:shared:default@1, ui:shared:approve@1, ui:shared:comment@1
 * If formKey is missing → treat as ui:shared:default@1
 *
 * Form (schema-driven): ui:form:<formId>@<version>
 * Example: ui:form:beneficiary-registration@1
 */

const SHARED_FORM_KEY_REGEX = /^ui:shared:([a-zA-Z0-9_-]+)@([a-zA-Z0-9]+)$/;
const FORM_FORM_KEY_REGEX = /^ui:form:([a-zA-Z0-9_-]+)@([a-zA-Z0-9]+)$/;

//export const DEFAULT_FORM_KEY = 'ui:shared:default@1' as const

export const DEFAULT_FORM_KEY = "" as const;

/**
 * Returns true if formKey matches the shared format: ui:shared:<page>@<version>
 */
export function isSharedFormKey(formKey: string | undefined | null): boolean {
  if (formKey == null || formKey === "") return false;
  return SHARED_FORM_KEY_REGEX.test(formKey);
}

/**
 * Returns true if formKey matches the schema-driven form format: ui:form:<formId>@<version>
 */
export function isFormFormKey(formKey: string | undefined | null): boolean {
  if (formKey == null || formKey === "") return false;
  return FORM_FORM_KEY_REGEX.test(formKey);
}

/**
 * Normalizes formKey: if missing or empty, returns DEFAULT_FORM_KEY (ui:shared:default@1).
 * Otherwise returns the given formKey as-is (caller can validate with isSharedFormKey / isFormFormKey).
 */
export function getNormalizedFormKey(
  formKey: string | undefined | null,
): string {
  const trimmed = typeof formKey === "string" ? formKey.trim() : "";
  return trimmed === "" ? DEFAULT_FORM_KEY : trimmed;
}

/**
 * Type of the form key for display or routing.
 */
export type FormKeyType = "shared" | "form" | "unknown";

/**
 * Classifies the form key as 'shared', 'form', or 'unknown'.
 * Uses normalized formKey (missing → ui:shared:default@1).
 */
export function getFormKeyType(
  formKey: string | undefined | null,
): FormKeyType {
  const normalized = getNormalizedFormKey(formKey);
  if (isSharedFormKey(normalized)) return "shared";
  if (isFormFormKey(normalized)) return "form";
  return "unknown";
}

//Todo extract projectKey from formKey and return it: want this default.1 from ui:shared:default@1
export function getKeyFromFormKey(formKey: string | undefined | null): string {
  if (formKey == null || formKey === "") return "";
  const normalized = getNormalizedFormKey(formKey);
  const beforeAt = normalized.split("@")[0] ?? "";
  const version = normalized.split("@")[1] ?? "";
  const namePart = beforeAt.split(":")[2] ?? "";
  return namePart ? `${namePart}.v${version}` : "";
}

export function getNameFromFormKey(formKey: string | undefined | null): string {
  if (formKey == null || formKey === "") return "";
  const normalized = getNormalizedFormKey(formKey);
  const beforeAt = normalized.split("@")[0] ?? "";
  return beforeAt.split(":")[2] ?? "";
}

export function getNormalizeClassNameFromFormKey(
  formKey: string | undefined | null,
): string {
  const normalized = getNameFromFormKey(formKey);
  return normalized
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, "");
}

export function getVersionFromFormKey(
  formKey: string | undefined | null,
): string {
  if (formKey == null || formKey === "") return "";
  const normalized = getNormalizedFormKey(formKey);
  return normalized.split("@")[1] ?? "";
}

/** Matches version folder names: v1, v2, v10, etc. */
export const isVersionFolderName = (name: string | undefined): boolean =>
  Boolean(name && /^v\d+$/.test(name));

/**
 * Discovery target for a step form key / Form descriptor.
 *
 * - `ui:shared:<name>@<v>` → `{ kind: "shared", page: "<name>.v<v>" }`
 *   → load from `process/shared/<page>`
 * - `ui:form:<name>@<v>` → `{ kind: "form", page: "<name>.v<v>" }`
 *   → load from `process/[...process]/(<processKey>)/<page>`
 * - missing / unknown → shared `default.v1`
 */
export interface IGRPFormDiscovery {
  kind: "shared" | "form";
  /** File stem used in dynamic import, e.g. `default.v1`, `pedido.v1`. */
  page: string;
}

const DEFAULT_SHARED_PAGE = "default.v1";

/**
 * Resolves where a step component should be loaded from, based on Form.type/page
 * (already derived from formKey via getFormKeyType / getKeyFromFormKey).
 */
export function getFormDiscovery(
  form?: { type?: FormKeyType; page?: string; version?: string } | null,
): IGRPFormDiscovery {
  if (!form) {
    return { kind: "shared", page: DEFAULT_SHARED_PAGE };
  }

  const page =
    form.page && form.page.trim() !== ""
      ? form.page
      : form.version
        ? `default.v${form.version}`
        : DEFAULT_SHARED_PAGE;

  if (form.type === "form") {
    return { kind: "form", page };
  }

  // shared | unknown | missing type → shared folder
  return { kind: "shared", page };
}

/**
 * Build a Form descriptor from a raw BPMN formKey string.
 * `ui:shared:approve@1` → `{ type: "shared", page: "approve.v1", version: "1" }`
 * `ui:form:pedido@1` → `{ type: "form", page: "pedido.v1", version: "1" }`
 */
export function formFromFormKey(formKey: string | undefined | null): {
  type: FormKeyType;
  page: string;
  version: string;
} {
  const type = getFormKeyType(formKey);
  const page = getKeyFromFormKey(formKey) || DEFAULT_SHARED_PAGE;
  const version = getVersionFromFormKey(formKey) || "1";
  return {
    type: type === "unknown" ? "shared" : type,
    page,
    version,
  };
}
