import { useEffect, useRef } from "react";
import { useMapStore } from "../stores/MapStore";

export const useMapInitialization = (
  mapRef: React.RefObject<HTMLDivElement>
) => {
  const { setMap } = useMapStore();
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (document.querySelector('script[src*="dapi.kakao.com"]')) {
      if (window.kakao && window.kakao.maps) {
        initializeMap();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_API_KEY
    }&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(initializeMap);
    };

    document.head.appendChild(script);

    function initializeMap() {
      const mapContainer = mapRef.current;
      const savedCenter = localStorage.getItem("mapCenter");
      const savedLevel = localStorage.getItem("mapLevel");

      const initialCenter = savedCenter
        ? new window.kakao.maps.LatLng(
            JSON.parse(savedCenter).lat,
            JSON.parse(savedCenter).lng
          )
        : new window.kakao.maps.LatLng(35.500701, 129.070667);
      const initialLevel = savedLevel ? parseInt(savedLevel) : 3;

      const map = new window.kakao.maps.Map(mapContainer, {
        center: initialCenter,
        level: initialLevel,
        mapTypeId: window.kakao.maps.MapTypeId.HYBRID,
      });

      mapInstanceRef.current = map;
      setMap(map);
    }
  }, []);

  return mapInstanceRef;
};
