import { ProcessManagementClient } from "@igrp/platform-process-management-client-ts";
import type { IGRPProcessClientConfig } from "../types";

let clientInstance: ProcessManagementClient | null = null;

export async function getIGRPProcessClient(
  config: IGRPProcessClientConfig,
): Promise<ProcessManagementClient> {
  clientInstance = ProcessManagementClient.create({
    baseUrl: config.baseUrl,
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
    },
  });
  return clientInstance;
}
