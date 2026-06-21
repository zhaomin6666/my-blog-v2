import { NextResponse } from "next/server";
import {
  logAgentDemoInfo,
  logAgentDemoWarn,
} from "@/features/agent-demo/agentDemoLogger";
import { getAgentDemoClientIdentifier } from "@/features/agent-demo/rateLimiter";
import { submitAgentDemoFeedback } from "@/features/agent-demo/observability/agentDemoFeedbackService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getFeedbackStatus(error?: string): number {
  switch (error) {
    case "invalid_request_id":
    case "invalid_feedback":
      return 400;
    case "request_not_found":
      return 404;
    case "rate_limited":
      return 429;
    case "feedback_unavailable":
      return 503;
    default:
      return 200;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const clientIdentifier = getAgentDemoClientIdentifier(request);
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    payload = {};
    logAgentDemoWarn("feedback_json_parse_failed", {
      clientIdentifier,
    });
  }

  const result = await submitAgentDemoFeedback(
    payload && typeof payload === "object" ? payload : {},
    {
      clientIdentifier,
    },
  );
  const status = getFeedbackStatus(result.error);

  logAgentDemoInfo("feedback_request_end", {
    ok: result.ok,
    error: result.error,
    status,
  });

  return NextResponse.json(result, { status });
}
