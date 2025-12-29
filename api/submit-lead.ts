// Serverless bridge to Google Apps Script to avoid browser CORS issues in production
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1YQSowWkDEYIAHcUJMyI08PnJwjJDFJUOoitfq3T4Gn7YcRCpD4ZxlFnb7oCDBoZL5w/exec";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  try {
    const payload = typeof req.body === "string" && req.body.length
      ? JSON.parse(req.body)
      : req.body || {};

    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true }));
  } catch (error) {
    console.error("submit-lead error", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Internal Server Error" }));
  }
}
