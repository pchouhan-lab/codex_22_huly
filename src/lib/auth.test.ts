import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseAdminEmails } from "./auth";

describe("parseAdminEmails", () => {
  it("normalizes comma-separated admin emails", () => {
    assert.deepEqual(parseAdminEmails(" PCHOUHAN@STARLAB.CO.IN, admin@example.com "), [
      "pchouhan@starlab.co.in",
      "admin@example.com"
    ]);
  });
});
