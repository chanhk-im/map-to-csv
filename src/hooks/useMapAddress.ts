import { useEffect, useRef } from "react";
import { Coord2AddressResult } from "../models/KakaoMapProps";
import { useAddressStore } from "../stores/AddressStore";
import { useIsDrawingStore } from "../stores/SystemStore";

export const useMapAddress = (mapInstanceRef: React.RefObject<any>) => {
  const { addressList, addAddress } = useAddressStore();
  const { isDrawing } = useIsDrawingStore();
  const overlayIsOpenRef = useRef(false);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const geocoder = new window.kakao.maps.services.Geocoder();
    const marker = new window.kakao.maps.Marker();

    const handleMapClick = (mouseEvent: { latLng: any }) => {
      if (overlayIsOpenRef.current || isDrawing) return;

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

                  if (addressList.some((item) => item.address === address)) {
                    alert("이미 추가된 주소입니다.");
                    return;
                  }

                  const index = addressList.length + 1;
                  const lat = latlng.getLat();
                  const lng = latlng.getLng();
                  var imageSrc =
                    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";
                  var imageSize = new window.kakao.maps.Size(64, 69);
                  var imageOption = {
                    offset: new window.kakao.maps.Point(27, 69),
                  };
                  var markerImage = new window.kakao.maps.MarkerImage(
                    imageSrc,
                    imageSize,
                    imageOption
                  );

                  const addedMarker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(lat, lng),
                    title: index.toString(),
                    image: markerImage,
                  });

                  addAddress({
                    address,
                    lat: latlng.getLat(),
                    lng: latlng.getLng(),
                    marker: addedMarker,
                  });
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
    };

    // 이벤트 리스너 등록
    window.kakao.maps.event.addListener(map, "click", handleMapClick);

    // cleanup 함수
    return () => {
      window.kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [isDrawing, addressList, mapInstanceRef.current]);
};
