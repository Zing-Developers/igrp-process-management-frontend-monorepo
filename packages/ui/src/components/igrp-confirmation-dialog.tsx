import {
  cn,
  IGRPButton,
  IGRPButtonPrimitive,
  IGRPCollapsibleContentPrimitive,
  IGRPCollapsiblePrimitive,
  IGRPCollapsibleTriggerPrimitive,
  IGRPCopyTo,
  IGRPDialogContentPrimitive,
  IGRPDialogDescriptionPrimitive,
  IGRPDialogFooterPrimitive,
  IGRPDialogHeaderPrimitive,
  IGRPDialogPrimitive,
  IGRPDialogTitlePrimitive,
  IGRPIcon,
  IGRPTextAreaPrimitive,
} from "@igrp/igrp-framework-react-design-system";
import { useEffect } from "react";
import { useState } from "react";

export interface IGRPConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmDelete: () => Promise<void>;
  description?: string;
  labelBtnCancel?: string;
  labelBtnConfirm?: string;
  textHeader?: string;
  isCompleted?: boolean;
  message?: string;
  /**
   * When `false`, the dialog can only be closed via the confirm action.
   * Escape, backdrop click and the X button are all neutralised. Useful for
   * non-cancellable success confirmations after destructive / one-shot
   * actions (e.g. "task completed" — the user must press the explicit
   * button so the host can decide where to navigate).
   * Defaults to `true`.
   */
  dismissable?: boolean;
}

const IGRPConfirmationDialogIconConfig = {
  success: {
    iconName: "CircleCheckBig" as const,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    animation: "animate-scale-in",
  },
  error: {
    iconName: "Ban" as const,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    animation: "animate-shake",
  },
};

export function IGRPConfirmationDialog({
  open,
  onOpenChange,
  confirmDelete,
  description,
  labelBtnConfirm = "Continuar",
  textHeader = "Confirmação Final",
  isCompleted = false,
  message = "",
  dismissable = true,
}: IGRPConfirmationDialogProps) {
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowIcon(true), 50);
      return () => clearTimeout(timer);
    }
    setShowIcon(false);
  }, [open]);

  const config = isCompleted
    ? IGRPConfirmationDialogIconConfig.success
    : IGRPConfirmationDialogIconConfig.error;

  // When `dismissable` is false, only allow the dialog to be opened from the
  // outside. Any attempt to close it (X, Esc, backdrop) is swallowed so the
  // host stays in control of when it actually goes away (typically via the
  // confirm button's navigation).
  const handleOpenChange = (next: boolean) => {
    if (!dismissable && !next) return;
    onOpenChange(next);
  };

  return (
    <IGRPDialogPrimitive open={open} onOpenChange={handleOpenChange}>
      <IGRPDialogContentPrimitive
        className={cn("space-y-4", isCompleted ? "max-w-md" : "")}
        showCloseButton={dismissable}
        onEscapeKeyDown={(e) => {
          if (!dismissable) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (!dismissable) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (!dismissable) e.preventDefault();
        }}
      >
        <div className="flex flex-col items-center gap-2 justify-center">
          <div
            aria-hidden="true"
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500",
              config.bgColor,
              showIcon ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
          >
            <IGRPIcon
              iconName={config.iconName}
              className={cn(
                "h-10 w-10",
                config.color,
                showIcon && config.animation,
              )}
            />
          </div>
          <IGRPDialogHeaderPrimitive>
            <IGRPDialogTitlePrimitive className="text-center">
              {textHeader}
            </IGRPDialogTitlePrimitive>
            <IGRPDialogDescriptionPrimitive className="text-center">
              {description}
            </IGRPDialogDescriptionPrimitive>
          </IGRPDialogHeaderPrimitive>
        </div>
        {message && (
          <IGRPCollapsiblePrimitive
            open={isMessageOpen}
            onOpenChange={setIsMessageOpen}
          >
            <IGRPCollapsibleTriggerPrimitive asChild>
              <IGRPButton
                variant="ghost"
                className="w-full justify-center"
                type="button"
              >
                <span className="text-sm font-medium">
                  {isMessageOpen ? "Ocultar detalhes" : "Mostrar detalhes"}
                </span>
                {isMessageOpen ? (
                  <IGRPIcon iconName="ChevronUp" />
                ) : (
                  <IGRPIcon iconName="ChevronDown" />
                )}
              </IGRPButton>
            </IGRPCollapsibleTriggerPrimitive>
            <IGRPCollapsibleContentPrimitive className="space-y-2">
              <div className="flex justify-between gap-2">
                <IGRPTextAreaPrimitive
                  value={message}
                  readOnly={true}
                  className="w-full flex-1"
                  rows={4}
                />
                <IGRPCopyTo value={message} />
              </div>
            </IGRPCollapsibleContentPrimitive>
          </IGRPCollapsiblePrimitive>
        )}
        <IGRPDialogFooterPrimitive>
          <IGRPButtonPrimitive
            variant="default"
            onClick={() => confirmDelete()}
            className="w-full"
          >
            {labelBtnConfirm}
          </IGRPButtonPrimitive>
        </IGRPDialogFooterPrimitive>
      </IGRPDialogContentPrimitive>
    </IGRPDialogPrimitive>
  );
}
