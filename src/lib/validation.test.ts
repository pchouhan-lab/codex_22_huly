import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatPhoneNumberInput } from "./contact-rules";
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

  it("rejects invalid phone numbers", () => {
    const result = contactSubmissionSchema.safeParse({
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "call me",
      message: "Please contact me about auto coverage.",
      company: ""
    });

    assert.equal(result.success, false);
  });

  it("accepts short non-empty messages", () => {
    const result = contactSubmissionSchema.safeParse({
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "515-555-0101",
      message: "Hi",
      company: ""
    });

    assert.equal(result.success, true);
  });

  it("formats phone numbers for the contact form", () => {
    assert.equal(formatPhoneNumberInput("5155550101"), "(515) 555-0101");
    assert.equal(formatPhoneNumberInput("15155550101"), "+1 (515) 555-0101");
  });

  it("trims valid submission values", () => {
    const result = contactSubmissionSchema.safeParse({
      name: " Jane Smith ",
      email: " jane@example.com ",
      phone: " 515-555-0101 ",
      message: " Please contact me about auto coverage. ",
      company: " "
    });

    assert.equal(result.success, true);

    if (result.success) {
      assert.equal(result.data.name, "Jane Smith");
      assert.equal(result.data.email, "jane@example.com");
      assert.equal(result.data.phone, "515-555-0101");
      assert.equal(result.data.message, "Please contact me about auto coverage.");
      assert.equal(result.data.company, "");
    }
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
