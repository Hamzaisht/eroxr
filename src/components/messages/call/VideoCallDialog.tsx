
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoControls } from "./VideoControls";
import { VideoSettings } from "./VideoSettings";
import { TippingControls } from "./TippingControls";
import { useTipNotifications } from "./useTipNotifications";
import { supabase } from "@/integrations/supabase/client";
import { useWebRTC } from "./hooks/useWebRTC";
import { useCamera } from "./hooks/useCamera";
import { useMediaTracks } from "./hooks/useMediaTracks";
import type { VideoCallDialogProps } from "./types";
import { useGhostMode } from "@/hooks/useGhostMode";
import { Ghost, AlertTriangle, Camera } from "lucide-react";
