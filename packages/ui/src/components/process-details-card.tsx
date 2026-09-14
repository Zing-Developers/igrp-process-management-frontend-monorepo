"use client";

import { IGRPCardDetails } from "@igrp/igrp-framework-react-design-system";
import { format } from "date-fns";

export interface ProcessDetailsCardProps {
  isVisible: boolean;
  processInstance: any;
}

export function ProcessDetailsCard({
  isVisible,
  processInstance,
}: ProcessDetailsCardProps) {
  const {
    statusDesc,
    number,
    procReleaseKey,
    userProfileStartedBy,
    startedBy,
    startedAt,
  } = processInstance || {};

  const startedByFullName = userProfileStartedBy?.fullName || startedBy;

  return isVisible ? (
    <IGRPCardDetails
      items={[
        {
          label: "Número",
          content: number,
          showCopyTo: true,
        },
        {
          label: "Código",
          content: procReleaseKey,
          showCopyTo: true,
        },
        {
          label: "Iniciado por",
          content: startedByFullName,
        },
        {
          label: "Iniciado em",
          content: format(startedAt, "dd/MM/yyyy HH:mm"),
        },
        {
          label: "Estado",
          content: statusDesc,
        },
      ]}
    />
  ) : null;
}
