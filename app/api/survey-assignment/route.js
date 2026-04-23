const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

export async function POST() {
  if (!GOOGLE_SCRIPT_URL) {
    return Response.json(
      {
        success: false,
        message: "Google Script URL is not configured.",
      },
      { status: 500 },
    );
  }

  try {
    const upstreamRes = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "assignClassification" }),
      cache: "no-store",
    });

    const rawText = await upstreamRes.text();
    let upstreamJson;

    try {
      upstreamJson = rawText ? JSON.parse(rawText) : {};
    } catch {
      upstreamJson = { raw: rawText };
    }

    if (!upstreamRes.ok) {
      return Response.json(
        {
          success: false,
          message: "Google Apps Script returned an error.",
          details: upstreamJson,
        },
        { status: 502 },
      );
    }

    const details = upstreamJson?.details ?? upstreamJson;

    if (!details?.classificationCode || !details?.disclosureText) {
      return Response.json(
        {
          success: false,
          message: "Invalid classification assignment response.",
          details: upstreamJson,
        },
        { status: 502 },
      );
    }

    return Response.json({ success: true, details });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to assign survey classification.",
      },
      { status: 500 },
    );
  }
}
