import test from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { parseRecommendations } from "../services/grok.service.js";

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
