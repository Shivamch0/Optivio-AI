import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BillingEvent } from "../model/billing.model.js";
import { User } from "../model/user.model.js";

const priceLookup = {
  pro: process.env.STRIPE_PRO_PRICE_ID,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

const createCheckout = asyncHandler(async (req, res) => {
  const { plan } = req.body;

  if (!["pro", "enterprise"].includes(plan)) {
    throw new ApiError(400, "Choose pro or enterprise plan");
  }

  const allowMockBilling = process.env.NODE_ENV !== "production" && process.env.ENABLE_MOCK_BILLING !== "false";
  let checkoutUrl = allowMockBilling
    ? `${process.env.CLIENT_URL || "http://localhost:5173"}/profile?checkout=mock-${plan}`
    : "";
  let provider = "mock";
  let providerSessionId = "";

  if (process.env.STRIPE_SECRET_KEY && priceLookup[plan]) {
    const body = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceLookup[plan],
      "line_items[0][quantity]": "1",
      success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/profile?checkout=success`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/profile?checkout=cancelled`,
      customer_email: req.user.email,
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (response.ok) {
      const data = await response.json();
      checkoutUrl = data.url;
      provider = "stripe";
      providerSessionId = data.id;
    }
  } else if (!allowMockBilling) {
    throw new ApiError(503, "Billing provider is not configured");
  }

  if (!checkoutUrl) {
    throw new ApiError(502, "Could not create checkout session");
  }

  const event = await BillingEvent.create({
    user: req.user._id,
    provider,
    plan,
    checkoutUrl,
    providerSessionId,
  });

  if (provider === "mock") {
    await User.findByIdAndUpdate(req.user._id, { $set: { subscriptionPlan: plan } });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { checkoutUrl, event }, "Checkout created"));
});

const getBillingHistory = asyncHandler(async (req, res) => {
  const events = await BillingEvent.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, events, "Billing history fetched"));
});

export { createCheckout, getBillingHistory };
