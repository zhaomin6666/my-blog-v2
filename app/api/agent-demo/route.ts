import { NextResponse } from "next/server";
import { createAgentDemoResponse } from "@/features/agent-demo/agentDemoService";

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

  const response = await createAgentDemoResponse(payload);

  return NextResponse.json(response, {
    status: getHttpStatus(response.error),
  });
}
