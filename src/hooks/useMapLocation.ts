import { useEffect } from "react";

export const useMapLocation = (mapInstanceRef: React.RefObject<any>) => {
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    window.kakao.maps.event.addListener(map, "center_changed", () => {
      const center = map.getCenter();
      localStorage.setItem(
        "mapCenter",
        JSON.stringify({
          lat: center.getLat(),
          lng: center.getLng(),
        })
      );
    });

    window.kakao.maps.event.addListener(map, "zoom_changed", () => {
      localStorage.setItem("mapLevel", map.getLevel().toString());
    });
  }, [mapInstanceRef.current]);
};
