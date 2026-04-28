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

function generateParticipantId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  // Fallback for runtimes without randomUUID.
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

  const cookieHeader = request.headers.get("cookie") || "";
  const existingParticipantId = getParticipantIdFromCookie(cookieHeader);
  const participantId = existingParticipantId || generateParticipantId();

  try {
    const upstreamRes = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "assignClassification", participantId }),
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

    const res = Response.json({ success: true, details, participantId });

    if (!existingParticipantId) {
      res.headers.set(
        "Set-Cookie",
        `${PARTICIPANT_COOKIE}=${encodeURIComponent(participantId)}; Path=/; SameSite=Lax; Max-Age=31536000`,
      );
    }

    return res;
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
