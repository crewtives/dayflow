export function LiveRegion({ message }: { message: string }) {
  return <p aria-atomic="true" aria-live="polite" className="sr-only">{message}</p>;
}
