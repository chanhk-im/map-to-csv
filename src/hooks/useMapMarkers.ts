import { useEffect } from "react";
import { useAddressStore } from "../stores/AddressStore";

export const useMapMarkers = (mapInstanceRef: React.RefObject<any>) => {
  const { addressList } = useAddressStore();

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    addressList.forEach((e) => {
      e.marker.setMap(map);
    });
  }, [addressList, mapInstanceRef.current]);
};
