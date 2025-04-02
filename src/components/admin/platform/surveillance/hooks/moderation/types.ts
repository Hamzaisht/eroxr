
import { LiveSession, SurveillanceContentItem, ModerationAction } from "../../types";

export interface ModerationActionResult {
  success: boolean;
  message?: string;
}

export interface ContentInteractions {
  viewers: any[];
  likers: any[];
  buyers: any[];
}
