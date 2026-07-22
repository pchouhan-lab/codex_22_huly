import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contactSubmissionSchema } from "./validation";

describe("contactSubmissionSchema", () => {
  it("accepts a valid contact submission", () => {
    const result = contactSubmissionSchema.safeParse({
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "515-555-0101",
      message: "Please contact me about auto coverage.",
      company: ""
    });

    assert.equal(result.success, true);
  });

  it("rejects invalid email addresses", () => {
    const result = contactSubmissionSchema.safeParse({
      name: "Jane Smith",
      email: "not-an-email",
      phone: "515-555-0101",
      message: "Please contact me.",
      company: ""
    });

    assert.equal(result.success, false);
  });

  it("rejects honeypot submissions", () => {
    const result = contactSubmissionSchema.safeParse({
      name: "Bot",
      email: "bot@example.com",
      phone: "515-555-0101",
      message: "Spam",
      company: "Filled by bot"
    });

    assert.equal(result.success, false);
  });
});
