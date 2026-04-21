const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxCVqLc94vOyO5lF14JGmi1oZTdNKLi5S_z8WemslAdeh_XdI9z_39BvrqKfDsVDfwj/exec";

export async function POST(request) {
  try {
    const body = await request.json();

    const upstreamRes = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

    return Response.json({ success: true, details: upstreamJson });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to submit survey response.",
      },
      { status: 500 },
    );
  }
}
