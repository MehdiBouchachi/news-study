const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

const PARTICIPANT_COOKIE = "newsStudyParticipantId";

function getParticipantIdFromCookie(cookieHeader) {
  if (!cookieHeader) return "";
  const cookies = cookieHeader.split(";").map((part) => part.trim());
  for (const item of cookies) {
    if (item.startsWith(`${PARTICIPANT_COOKIE}=`)) {
      return decodeURIComponent(item.slice(PARTICIPANT_COOKIE.length + 1));
    }
  }
  return "";
}

export async function POST(request) {
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
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json(
        {
          success: false,
          message: "Invalid survey payload.",
        },
        { status: 400 },
      );
    }

    const participantId = getParticipantIdFromCookie(
      request.headers.get("cookie") || "",
    );

    const upstreamBody = participantId
      ? { action: "submitResponse", participantId, ...body }
      : { action: "submitResponse", ...body };

    const upstreamRes = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upstreamBody),
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
