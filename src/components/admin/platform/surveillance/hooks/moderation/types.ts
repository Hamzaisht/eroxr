
import { SurveillanceContentItem } from "@/types/surveillance";
import { ModerationAction } from "@/types/surveillance";

export interface ModerationActionResult {
  success: boolean;
  message?: string;
}

export interface ContentInteractions {
  viewers: any[];
  likers: any[];
  buyers: any[];
}
