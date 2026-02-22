type BuildRepairCreatedMessageParams = {
  billNo: string;
  trackingUrl: string;
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
