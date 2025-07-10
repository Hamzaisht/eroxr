import { supabase } from '@/integrations/supabase/client';

interface GeoLocation {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

interface DeviceInfo {
  userAgent: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export class GeoTracker {
  private sessionId: string | null = null;
  private hasTracked = false;

  async trackUserSession(creatorId: string, userId?: string): Promise<void> {
    if (this.hasTracked) return;
    
    try {
      const geoData = await this.getGeolocation();
      const deviceInfo = this.getDeviceInfo();
      const ipAddress = await this.getIPAddress();

      const sessionData = {
        user_id: userId || null,
        creator_id: creatorId,
        ip_address: ipAddress,
        country: geoData.country,
        region: geoData.region,
        city: geoData.city,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        user_agent: deviceInfo.userAgent,
        device_type: deviceInfo.deviceType,
        page_views: 1
      };

      const { data, error } = await supabase
        .from('user_sessions')
        .insert(sessionData)
        .select('id')
        .single();

      if (error) {
        console.error('Error tracking session:', error);
        return;
      }

      this.sessionId = data.id;
      this.hasTracked = true;
      
      // Track page views during session
      this.setupPageViewTracking();
    } catch (error) {
      console.error('Geolocation tracking failed:', error);
    }
  }

  private async getGeolocation(): Promise<GeoLocation> {
    try {
      // Try to get precise location first (requires user permission)
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          enableHighAccuracy: false
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding to get location details
      const locationData = await this.reverseGeocode(latitude, longitude);
      
      return {
        latitude,
        longitude,
        ...locationData
      };
    } catch (error) {
      console.log('Precise geolocation failed, using IP-based location');
      // Fallback to IP-based geolocation
      return await this.getIPBasedLocation();
    }
  }

  private async reverseGeocode(lat: number, lng: number): Promise<GeoLocation> {
    try {
      // Use a free geocoding service (you might want to use a proper API key for production)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      
      return {
        country: data.countryName,
        region: data.principalSubdivision,
        city: data.city || data.locality
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return {};
    }
  }

  private async getIPBasedLocation(): Promise<GeoLocation> {
    try {
      // Use a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) throw new Error('IP geolocation failed');
      
      const data = await response.json();
      
      return {
        country: data.country_name,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (error) {
      console.error('IP-based geolocation failed:', error);
      // Return default values if all geolocation methods fail
      return {
        country: 'Unknown',
        region: 'Unknown', 
        city: 'Unknown'
      };
    }
  }

  private async getIPAddress(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Failed to get IP address:', error);
      return null;
    }
  }

  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    let deviceType: DeviceInfo['deviceType'] = 'desktop';

    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      if (/iPad|Android(?!.*Mobile)/i.test(userAgent)) {
        deviceType = 'tablet';
      } else {
        deviceType = 'mobile';
      }
    }

    return {
      userAgent,
      deviceType
    };
  }

  private setupPageViewTracking(): void {
    if (!this.sessionId) return;

    let pageViewCount = 1;
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.sessionId) {
        pageViewCount++;
        this.updatePageViews(pageViewCount);
      }
    });

    // Track when user is about to leave
    window.addEventListener('beforeunload', () => {
      if (this.sessionId) {
        this.endSession();
      }
    });
  }

  private async updatePageViews(count: number): Promise<void> {
    if (!this.sessionId) return;

    try {
      await supabase
        .from('user_sessions')
        .update({ page_views: count })
        .eq('id', this.sessionId);
    } catch (error) {
      console.error('Failed to update page views:', error);
    }
  }

  private async endSession(): Promise<void> {
    if (!this.sessionId) return;

    try {
      await supabase
        .from('user_sessions')
        .update({ session_end: new Date().toISOString() })
        .eq('id', this.sessionId);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }
}

// Global instance for tracking
export const geoTracker = new GeoTracker();