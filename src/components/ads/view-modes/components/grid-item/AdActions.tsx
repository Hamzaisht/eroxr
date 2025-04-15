
import { AdActions as BaseAdActions } from "../../../video-profile-card/AdActions";
import type { DatingAd } from "../../../types/dating";

export const AdActions = ({ ad }: { ad: DatingAd }) => {
  return <BaseAdActions ad={ad} />;
};
