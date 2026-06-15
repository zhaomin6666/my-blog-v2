import { NextResponse } from "next/server";
import { createAgentDemoResponse } from "@/features/agent-demo/agentDemoService";
import { getAgentDemoClientIdentifier } from "@/features/agent-demo/rateLimiter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getHttpStatus(error?: string): number {
  switch (error) {
    case "invalid_payload":
    case "invalid_question":
    case "empty_question":
    case "question_too_long":
    case "abnormal_payload":
    case "invalid_locale":
      return 400;
    case "missing_api_url":
    case "missing_api_key":
    case "missing_model":
      return 503;
    case "rate_limited":
      return 429;
    case "upstream_timeout":
      return 504;
    case "upstream_error":
    case "invalid_response":
    case "empty_answer":
      return 502;
    default:
      return 200;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const response = await createAgentDemoResponse(payload, {
    rateLimitIdentifier: getAgentDemoClientIdentifier(request),
  });

  const status = getHttpStatus(response.error);
  const headers = new Headers();

  if (response.error === "rate_limited" && response.usage?.rateLimitResetAt) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((response.usage.rateLimitResetAt - Date.now()) / 1000),
    );
    headers.set("Retry-After", retryAfterSeconds.toString());
  }

  return NextResponse.json(response, {
    status,
    headers,
  });
}
