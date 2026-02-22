type BuildRepairCreatedMessageParams = {
  billNo: string;
  trackingUrl: string;
};

export function buildTrackingUrl(baseUrl: string, trackingToken: string) {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  return `${normalizedBase}/t/${encodeURIComponent(trackingToken)}`;
}

const SMS_CHAR_LIMIT = 170;

export function buildRepairCreatedMessage({
  billNo,
  trackingUrl,
}: BuildRepairCreatedMessageParams) {
  const protocolStrippedLink = trackingUrl.replace(/^https?:\/\//i, "");
  const candidates = [
    `DOB: Repair ${billNo} created. Track: ${trackingUrl}`,
    `DOB: Repair ${billNo} created. ${trackingUrl}`,
    `DOB: Repair ${billNo} created. Track: ${protocolStrippedLink}`,
    `DOB: ${billNo} created. ${protocolStrippedLink}`,
  ];

  for (const candidate of candidates) {
    if (candidate.length <= SMS_CHAR_LIMIT) {
      return candidate;
    }
  }

  return candidates[candidates.length - 1].slice(0, SMS_CHAR_LIMIT);
}
