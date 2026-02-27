type BuildRepairCreatedMessageParams = {
  billNo: string;
  trackingUrl: string;
};

type BuildRepairStatusMessageParams = {
  billNo: string;
  nextStatus: "PROCESSING" | "REPAIR_COMPLETED" | "DELIVERED";
  trackingUrl?: string;
};

type BuildDeliveryReminderMessageParams = {
  billNo: string;
  dueDate: Date;
};

export function buildTrackingUrl(baseUrl: string, trackingToken: string) {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  return `${normalizedBase}/tracking?token=${encodeURIComponent(trackingToken)}`;
}

const SMS_CHAR_LIMIT = 170;

function pickBoundedMessage(candidates: string[]) {
  for (const candidate of candidates) {
    if (candidate.length <= SMS_CHAR_LIMIT) {
      return candidate;
    }
  }
  return candidates[candidates.length - 1].slice(0, SMS_CHAR_LIMIT);
}

function buildRepairLifecycleMessage(
  billNo: string,
  trackingUrl: string,
  verb: "created" | "updated"
) {
  const protocolStrippedLink = trackingUrl.replace(/^https?:\/\//i, "");
  const candidates = [
    `DOB: Repair ${billNo} ${verb}. Track: ${trackingUrl}`,
    `DOB: Repair ${billNo} ${verb}. ${trackingUrl}`,
    `DOB: Repair ${billNo} ${verb}. Track: ${protocolStrippedLink}`,
    `DOB: ${billNo} ${verb}. ${protocolStrippedLink}`,
  ];
  return pickBoundedMessage(candidates);
}

export function buildRepairCreatedMessage({
  billNo,
  trackingUrl,
}: BuildRepairCreatedMessageParams) {
  return buildRepairLifecycleMessage(billNo, trackingUrl, "created");
}

export function buildRepairUpdatedMessage({
  billNo,
  trackingUrl,
}: BuildRepairCreatedMessageParams) {
  return buildRepairLifecycleMessage(billNo, trackingUrl, "updated");
}

export function buildRepairStatusMessage({
  billNo,
  nextStatus,
  trackingUrl,
}: BuildRepairStatusMessageParams) {
  if (nextStatus === "PROCESSING") {
    if (!trackingUrl) {
      return pickBoundedMessage([`DOB: Repair ${billNo} started.`]);
    }
    const protocolStrippedLink = trackingUrl.replace(/^https?:\/\//i, "");
    return pickBoundedMessage([
      `DOB: Repair ${billNo} started. Track: ${trackingUrl}`,
      `DOB: Repair ${billNo} started. ${trackingUrl}`,
      `DOB: Repair ${billNo} started. Track: ${protocolStrippedLink}`,
    ]);
  }

  if (nextStatus === "REPAIR_COMPLETED") {
    if (!trackingUrl) {
      return pickBoundedMessage([
        `DOB: Repair ${billNo} completed. Ready for pickup.`,
      ]);
    }
    const protocolStrippedLink = trackingUrl.replace(/^https?:\/\//i, "");
    return pickBoundedMessage([
      `DOB: Repair ${billNo} completed. Ready for pickup. Track: ${trackingUrl}`,
      `DOB: Repair ${billNo} completed. Ready for pickup. ${trackingUrl}`,
      `DOB: Repair ${billNo} ready. Track: ${protocolStrippedLink}`,
    ]);
  }

  return pickBoundedMessage([
    `DOB: Repair ${billNo} delivered successfully. Thank you.`,
  ]);
}

export function buildDeliveryReminderMessage({
  billNo,
  dueDate,
}: BuildDeliveryReminderMessageParams) {
  const dueLabel = dueDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  return pickBoundedMessage([
    `DOB Reminder: Repair ${billNo} is due on ${dueLabel}. Please arrange pickup.`,
    `DOB Reminder: ${billNo} due ${dueLabel}. Please arrange pickup.`,
  ]);
}
