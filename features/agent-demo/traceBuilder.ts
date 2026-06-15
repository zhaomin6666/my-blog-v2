import { AGENT_DEMO_TRACE_STEPS } from "./agentDemoConfig";
import type {
  AgentDemoLocale,
  AgentTraceStep,
  AgentTraceStepId,
  AgentTraceStepStatus,
} from "./agentDemoTypes";

const traceLabels: Record<AgentDemoLocale, Record<AgentTraceStepId, string>> = {
  zh: {
    input_validation: "输入校验",
    rate_limit_check: "用量检查",
    scope_check: "范围识别",
    retrieve_context: "检索公开内容",
    generate_answer: "生成回答",
  },
  en: {
    input_validation: "Input validation",
    rate_limit_check: "Rate limit check",
    scope_check: "Scope check",
    retrieve_context: "Retrieve public context",
    generate_answer: "Generate answer",
  },
};

export function createAgentTrace(
  locale: AgentDemoLocale = "zh",
): AgentTraceStep[] {
  return AGENT_DEMO_TRACE_STEPS.map((step) => ({
    step,
    label: traceLabels[locale][step],
    status: "pending",
  }));
}

export function updateAgentTraceStep(
  trace: AgentTraceStep[],
  step: AgentTraceStepId,
  status: AgentTraceStepStatus,
  detail?: string,
): AgentTraceStep[] {
  return trace.map((traceStep) =>
    traceStep.step === step
      ? {
          ...traceStep,
          status,
          ...(detail ? { detail } : {}),
        }
      : traceStep,
  );
}

export function buildFoundationTrace(
  locale: AgentDemoLocale = "zh",
): AgentTraceStep[] {
  return createAgentTrace(locale).map((traceStep) => {
    if (
      traceStep.step === "retrieve_context" ||
      traceStep.step === "generate_answer"
    ) {
      return {
        ...traceStep,
        status: "pending",
        detail:
          locale === "zh"
            ? "后续阶段接入，只读上下文与模型生成尚未启用。"
            : "Deferred to later phases; read-only retrieval and model generation are not enabled yet.",
      };
    }

    return {
      ...traceStep,
      status: "passed",
      detail:
        locale === "zh"
          ? "Phase 10.1 已定义该步骤的契约。"
          : "Phase 10.1 defines the contract for this step.",
    };
  });
}
