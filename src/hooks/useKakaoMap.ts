import { useRef } from "react";
import { useMapInitialization } from "./useMapInitialization";
import { useMapLocation } from "./useMapLocation";
import { useMapMarkers } from "./useMapMarkers";
import { useMapDrawing } from "./useMapDrawing";
import { useMapAddress } from "./useMapAddress";

// Declare kakao property on the window object
declare global {
  interface Window {
    kakao: any;
  }
}

const useKakaoMap = (mapRef: React.RefObject<HTMLDivElement>) => {
  const mapInstanceRef = useMapInitialization(mapRef);
  useMapLocation(mapInstanceRef);
  useMapMarkers(mapInstanceRef);
  useMapDrawing(mapInstanceRef);
  useMapAddress(mapInstanceRef);
};

export default useKakaoMap;
