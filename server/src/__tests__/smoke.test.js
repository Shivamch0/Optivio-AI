import test from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { parseRecommendations } from "../services/grok.service.js";
import { normalizeError } from "../middleware/erro.middleware.js";

test("express app loads with core routers", () => {
  assert.equal(typeof app.use, "function");
});

test("api response marks 2xx statuses as success", () => {
  const response = new ApiResponse(200, { ok: true });

  assert.equal(response.success, true);
  assert.deepEqual(response.data, { ok: true });
});

test("grok recommendation parser accepts JSON arrays", () => {
  const recommendations = parseRecommendations(
    '```json\n["Improve internal links.", "Compress images.", "Rewrite metadata.", "Fix broken links."]\n```',
  );

  assert.deepEqual(recommendations, [
    "Improve internal links.",
    "Compress images.",
    "Rewrite metadata.",
    "Fix broken links.",
  ]);
});

test("duplicate domain errors return readable messages", () => {
  const error = normalizeError({
    code: 11000,
    keyPattern: { domain: 1 },
    keyValue: { domain: "github.com" },
  });

  assert.equal(error.statusCode, 409);
  assert.equal(
    error.message,
    "This website domain is already added. Please use a different domain or select the existing website.",
  );
});

test("unexpected server errors do not leak internal details", () => {
  const error = normalizeError(new Error("Database stack trace details"));

  assert.equal(error.statusCode, 500);
  assert.equal(error.message, "Something went wrong on our side. Please try again in a moment.");
});

test("validation errors return the first field message", () => {
  const error = normalizeError({
    name: "ValidationError",
    errors: {
      email: { message: "Enter a valid email address." },
      password: { message: "Password must be at least 6 characters." },
    },
  });

  assert.equal(error.statusCode, 400);
  assert.equal(error.message, "Enter a valid email address.");
  assert.deepEqual(error.errors, [
    "Enter a valid email address.",
    "Password must be at least 6 characters.",
  ]);
});
