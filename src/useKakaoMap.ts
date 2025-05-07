import { useEffect, useRef } from "react";
import { Coord2AddressResult } from "./models/KakaoMapProps";
import { useAddressStore } from "./stores/AddressStore";
import { drawingManagerOptions } from "./options/DrawingManagerOption";
import { useDrawingManagerStore } from "./stores/DrawingManagerStore";
import { useMapStore } from "./stores/MapStore";
import { useIsDrawingStore, useIsFirstLoadStore } from "./stores/SystemStore";
import { cancelDrawing, selectOverlay } from "./DrawingTools";

// Declare kakao property on the window object
declare global {
  interface Window {
    kakao: any;
  }
}

const useKakaoMap = (mapRef: React.RefObject<HTMLDivElement>) => {
  const overlayIsOpenRef = useRef(false);
  const { addressList, addAddress } = useAddressStore();
  const { drawingManager, setDrawingManager } = useDrawingManagerStore();
  const { setMap } = useMapStore();
  const { isFirstLoad, setIsFirstLoad } = useIsFirstLoadStore();
  const { isDrawing } = useIsDrawingStore();
  const mapInstanceRef = useRef<any>(null);
  const drawingManagerRef = useRef<any>(null);

  // 1. 지도 초기화 (한 번만 실행)
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
    }&libraries=services,drawing&autoload=false`;
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
  }, []); // 빈 의존성 배열로 처음 마운트될 때만 실행

  // 2. DrawingManager 초기화 (지도가 초기화된 후 한 번만 실행)
  useEffect(() => {
    if (!mapInstanceRef.current || drawingManagerRef.current) return;

    const map = mapInstanceRef.current;
    console.log("Initializing DrawingManager...");

    try {
      const manager = new window.kakao.maps.drawing.DrawingManager({
        map: map,
        drawingMode: [window.kakao.maps.drawing.OverlayType.POLYLINE],
        polylineOptions: {
          draggable: true,
          removable: true,
          editable: true,
          strokeColor: "#39f",
          hintStrokeStyle: "dash",
          hintStrokeOpacity: 0.5,
        },
      });

      console.log("DrawingManager created:", manager);
      drawingManagerRef.current = manager;
      setDrawingManager(manager);
      console.log("DrawingManager set in store");

      // Add event listeners for drawing manager
      window.kakao.maps.event.addListener(manager, "drawstart", function () {
        console.log("Drawing started");
      });

      window.kakao.maps.event.addListener(manager, "drawend", function () {
        console.log("Drawing ended");
      });
    } catch (error) {
      console.error("Failed to initialize DrawingManager:", error);
    }
  }, [mapInstanceRef.current]); // mapInstanceRef.current가 설정된 후 한 번만 실행

  // 3. 지도 위치 저장 (지도 위치가 변경될 때마다 실행)
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

  // 4. 마커 표시 (addressList가 변경될 때마다 실행)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    var imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";
    var imageSize = new window.kakao.maps.Size(64, 69);
    var imageOption = { offset: new window.kakao.maps.Point(27, 69) };
    var markerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );

    addressList.forEach((e) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(e.lat, e.lng),
        title: e.index.toString(),
        image: markerImage,
      });
      marker.setMap(map);
    });
  }, [addressList, mapInstanceRef.current]);

  // 5. 클릭 이벤트 처리 (isDrawing 상태가 변경될 때마다 실행)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const geocoder = new window.kakao.maps.services.Geocoder();
    const marker = new window.kakao.maps.Marker();

    const handleMapClick = (mouseEvent: { latLng: any }) => {
      if (overlayIsOpenRef.current) return;
      if (isDrawing) {
        // drawing 모드일 때는 클릭 이벤트를 무시
        return;
      }
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
                  addAddress({
                    index: addressList.length + 1,
                    address,
                    lat: latlng.getLat(),
                    lng: latlng.getLng(),
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

export default useKakaoMap;
