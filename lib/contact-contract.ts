/** A successful HTTP response alone never proves that an inquiry was delivered. */
export function deliveryState(result: unknown): 'delivered' | 'accepted' | null {
  if (typeof result !== 'object' || result === null) return null;
  if ('delivered' in result && result.delivered === true) return 'delivered';
  if ('accepted' in result && result.accepted === true) return 'accepted';
  return null;
}
