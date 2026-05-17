import test from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";
import { ApiResponse } from "../utils/ApiResponse.js";

test("express app loads with core routers", () => {
  assert.equal(typeof app.use, "function");
});

test("api response marks 2xx statuses as success", () => {
  const response = new ApiResponse(200, { ok: true });

  assert.equal(response.success, true);
  assert.deepEqual(response.data, { ok: true });
});
