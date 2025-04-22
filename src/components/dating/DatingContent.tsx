
import { DatingContentController } from "./DatingContentController";

/**
 * Main DatingContent wrapper for the body dating experience.
 * Handles only prop passing and composition.
 */
export function DatingContent(props: any) {
  return <DatingContentController {...props} />;
}
