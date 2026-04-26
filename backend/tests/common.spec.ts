import { describe, expect, it } from "vitest";
import { slugify } from "../src/core/utils/common";
import { getPagination } from "../src/core/utils/pagination";

describe("common utils", () => {
  it("slugifies product names", () => {
    expect(slugify("Fresh Tomato 500g")).toBe("fresh-tomato-500g");
  });

  it("builds safe pagination defaults", () => {
    expect(getPagination(undefined, undefined)).toEqual({
      page: 1,
      limit: 20,
      skip: 0
    });
  });
});
