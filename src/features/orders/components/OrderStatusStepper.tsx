import { Clock, Check, X } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { formatDateTime, cn } from "@/lib/utils";
import type { OrderStatus } from "../types/orders.types";

export type OrderStatusStepperProps = {
  status: OrderStatus;
  creationDate?: string;
  className?: string;
};

const STEP_ORDER: OrderStatus[] = ["Pending", "Placed", "Shipped", "Delivered"];
const STEP_COUNT = STEP_ORDER.length;

// Index (in STEP_ORDER) where a cancellation is visualized, i.e. right after
// "Placed". Named constant since it's referenced in a few places below.
const CANCELLED_AT_INDEX = 1;

const STEP_DETAILS: Record<
  OrderStatus,
  { label: string; description: string }
> = {
  Pending: { label: "Pending", description: "Order received" },
  Placed: { label: "Placed", description: "Payment confirmed" },
  Shipped: { label: "Shipped", description: "On the way" },
  Delivered: { label: "Delivered", description: "Completed" },
  Cancelled: { label: "Cancelled", description: "Order was cancelled" },
};

export function OrderStatusStepper({
  status,
  creationDate,
  className,
}: OrderStatusStepperProps) {
  const isCancelled = status === "Cancelled";
  const currentStepIndex = isCancelled
    ? CANCELLED_AT_INDEX
    : STEP_ORDER.indexOf(status);

  const getActionPrompt = () => {
    switch (status) {
      case "Pending":
        return "Mark as placed";
      case "Placed":
        return "Mark as shipped or Cancel order";
      case "Shipped":
        return "Mark as delivered (Final step)";
      case "Delivered":
        return "Order fulfilled and delivered";
      case "Cancelled":
        return "Order has been cancelled";
      default:
        return "Track current order progress";
    }
  };

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border p-8 shadow-xs space-y-10 pb-16",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-soft border border-border flex items-center justify-center text-sidebar-bg shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <Typography variant="h3" className="font-semibold text-sidebar-bg">
              Order status
            </Typography>
            <Typography variant="muted" className="text-xs text-text-secondary">
              Track the current status and next steps
            </Typography>
          </div>
        </div>

        <div
          className={cn(
            "px-3.5 py-2 rounded-xl border text-xs self-start sm:self-auto",
            isCancelled
              ? "bg-status-danger-bg text-status-danger-text border-status-danger-text/20"
              : status === "Delivered"
                ? "bg-surface-mint border-brand-primary/20 text-brand-primary"
                : "bg-surface-mint/50 border-brand-primary/30 text-sidebar-bg",
          )}
        >
          <Typography
            variant="caption"
            className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block mb-0.5"
          >
            Available actions:
          </Typography>
          <Typography
            variant="body"
            className="font-semibold text-inherit text-xs"
          >
            {getActionPrompt()}
          </Typography>
        </div>
      </div>

      {/*
        Stepper.

        This is deliberately built on CSS Grid rather than a flex row of
        flex-1 items. With flex-grow, each step's fixed-width content (the
        circle + label block) competes for space in ways that are easy to
        get subtly wrong — a small change to one step's width can make the
        connector lines blow out and push later steps off screen, which is
        exactly what happened with earlier flex-based attempts here.

        Grid with N equal `1fr` columns can't do that: every column is
        guaranteed the same width no matter what its content needs, so the
        row can never exceed the container. The connector line is drawn
        separately as absolutely-positioned segments, each pinned by
        percentage to the exact horizontal midpoint between two circles —
        so it lines up correctly regardless of container width, and never
        interacts with flex sizing at all.
      */}
      <div className="relative pt-2 pb-10 -mx-8 px-0">
        <style>{`
          @keyframes statusLineRunner {
            0% { transform: translateX(-100%); opacity: 0.2; }
            50% { opacity: 1; }
            100% { transform: translateX(200%); opacity: 0.2; }
          }
        `}</style>

        <div className="relative">
          {/* Connector line, one absolutely positioned segment per gap between steps */}
          <div className="absolute top-5 left-0 right-0 z-0 pointer-events-none">
            {STEP_ORDER.slice(0, -1).map((_, index) => {
              const segmentLeftPct = ((index + 0.5) / STEP_COUNT) * 100;
              const segmentWidthPct = (1 / STEP_COUNT) * 100;
              // Filled (green) whenever this segment has already been
              // passed. Intentionally NOT gated on `!isCancelled` — that
              // is what keeps the Pending -> Placed segment green even
              // after cancellation, since currentStepIndex is still 1 in
              // that case. It never overlaps with the red segment below
              // because index === CANCELLED_AT_INDEX is never
              // `< currentStepIndex` when cancelled.
              const isFilled = index < currentStepIndex;
              const isCancelSegment =
                isCancelled && index === CANCELLED_AT_INDEX;
              const isRunning = !isCancelled && currentStepIndex === index;

              return (
                <div
                  key={`connector-${index}`}
                  className="absolute h-1 rounded-full bg-border overflow-hidden"
                  style={{
                    left: `${segmentLeftPct}%`,
                    width: `${segmentWidthPct}%`,
                  }}
                >
                  {isFilled && !isCancelSegment && (
                    <div className="absolute inset-0 bg-brand-primary rounded-full" />
                  )}
                  {isCancelSegment && (
                    <div className="absolute inset-0 bg-status-danger-text rounded-full" />
                  )}
                  {isRunning && (
                    <div
                      className="absolute inset-y-0 w-1/2 bg-brand-primary rounded-full"
                      style={{
                        animation: "statusLineRunner 1.6s infinite ease-in-out",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Cancelled marker, centered on the segment where cancellation happened */}
          {isCancelled && (
            <div
              className="absolute top-5 -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${((CANCELLED_AT_INDEX + 1) / STEP_COUNT) * 100}%`,
              }}
            >
              <div className="w-7 h-7 rounded-full bg-status-danger-text text-white flex items-center justify-center ring-4 ring-card shadow-md">
                <X className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
          )}

          {/* Circles + labels */}
          <div
            className="relative grid"
            style={{ gridTemplateColumns: `repeat(${STEP_COUNT}, 1fr)` }}
          >
            {STEP_ORDER.map((step, index) => {
              const isCancelledNode =
                isCancelled && index === CANCELLED_AT_INDEX;
              const isCompleted =
                currentStepIndex > index ||
                (isCancelled && currentStepIndex >= index);
              const isCurrent = !isCancelled && currentStepIndex === index;

              return (
                <div
                  key={step}
                  className="relative z-10 flex flex-col items-center px-2 text-center"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-card",
                      isCancelledNode
                        ? "bg-status-danger-text text-white shadow-xs"
                        : isCompleted
                          ? "bg-brand-primary text-white shadow-xs"
                          : isCurrent
                            ? "bg-brand-primary text-white ring-brand-primary/20"
                            : "bg-surface-soft border-2 border-border text-text-secondary",
                    )}
                  >
                    {isCancelledNode ? (
                      <X className="w-5 h-5 stroke-[2.5]" />
                    ) : isCompleted ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-border" />
                    )}
                  </div>

                  <div className="mt-3 flex flex-col items-center w-full">
                    <Typography
                      variant="body"
                      className={cn(
                        "text-xs font-bold",
                        isCancelledNode
                          ? "text-status-danger-text font-bold"
                          : isCompleted
                            ? "text-sidebar-bg"
                            : "text-text-secondary",
                      )}
                    >
                      {isCancelledNode ? "Cancelled" : STEP_DETAILS[step].label}
                    </Typography>
                    <Typography
                      variant="muted"
                      className="text-[11px] text-text-secondary mt-0.5"
                    >
                      {isCancelledNode
                        ? "Order was cancelled"
                        : STEP_DETAILS[step].description}
                    </Typography>

                    {step === "Placed" && creationDate && !isCancelled && (
                      <Typography
                        variant="caption"
                        className="text-[10px] text-text-secondary font-mono mt-1 text-center"
                      >
                        {formatDateTime(creationDate)}
                      </Typography>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderStatusStepper;
