import { useEffect, useRef } from "react";
import { Coord2AddressResult } from "./models/KakaoMapProps";
import { useAddressStore } from "./stores/AddressStore";

// Declare kakao property on the window object
declare global {
  interface Window {
    kakao: any;
  }
}

const useKakaoMap = (mapRef: React.RefObject<HTMLDivElement>) => {
  const overlayIsOpenRef = useRef(false);
  const { addressList, addAddress } = useAddressStore();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=9ddfb885a3d518940c70b240b52bfefc&libraries=services&autoload=false";
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = mapRef.current;
        const map = new window.kakao.maps.Map(mapContainer, {
          center: new window.kakao.maps.LatLng(35.500701, 129.070667),
          level: 3,
          mapTypeId: window.kakao.maps.MapTypeId.HYBRID,
        });

        const geocoder = new window.kakao.maps.services.Geocoder();
        const marker = new window.kakao.maps.Marker();

        window.kakao.maps.event.addListener(
          map,
          "click",
          (mouseEvent: { latLng: any }) => {
            if (overlayIsOpenRef.current) return;
            overlayIsOpenRef.current = true;

            const latlng = mouseEvent.latLng;

            geocoder.coord2Address(
              latlng.getLng(),
              latlng.getLat(),
              function (result: Coord2AddressResult[], status: any) {
                if (status === window.kakao.maps.services.Status.OK) {
                  const address =
                    result[0].road_address?.address_name ||
                    result[0].address.address_name;

                  marker.setPosition(latlng);
                  marker.setMap(map);

                  const iwContent = `
                  <div class="info-window" style="padding: 10px;">
                    <div style="margin-bottom: 8px;">${address}</div>
                    <div class="button-group">
                      <button class="add-button" id="add">추가</button>
                      <button class="cancle-button" id="cancle">취소</button>
                    </div>
                  </div>
                `;

                  const customOverlay = new window.kakao.maps.CustomOverlay({
                    map: map,
                    position: latlng,
                    content: iwContent,
                    yAnchor: 1,
                  });

                  setTimeout(() => {
                    const addButton = document.getElementById("add");
                    const cancleButton = document.getElementById("cancle");

                    if (addButton) {
                      addButton.onclick = () => {
                        overlayIsOpenRef.current = false;
                        customOverlay.setMap(null);
                        marker.setMap(null);

                        if (
                          addressList.some((item) => item.address === address)
                        ) {
                          alert("이미 추가된 주소입니다.");
                          return;
                        }

                        addAddress({ index: addressList.length + 1, address });
                      };
                    }

                    if (cancleButton) {
                      cancleButton.onclick = () => {
                        overlayIsOpenRef.current = false;
                        customOverlay.setMap(null);
                        marker.setMap(null);
                      };
                    }
                  }, 0);
                }
              }
            );
          }
        );
      });
    };

    document.head.appendChild(script);
  }, [mapRef]);
};

export default useKakaoMap;
