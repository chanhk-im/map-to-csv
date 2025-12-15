import { useEffect, useRef } from "react";
import { useDrawingStateStore, useIsDrawingStore } from "../stores/SystemStore";
import { DrawingState } from "../options/DrawingState";
import { useDrawedLineStore } from "../stores/DrawedLineStore";
import { useGridModeStore } from "../stores/SystemStore";

// 격자 생성에 필요한 상수
const GRID_SPACING_METERS = 100; // 격자 간격 (미터)

// 위도 1도의 거리 (미터)
const LATITUDE_DEGREE_DISTANCE = 111000;
// 경도 1도의 거리 (위도에 따라 변함)
const getLongitudeDegreeDistance = (latitude: number) => {
  return 111000 * Math.cos(latitude * (Math.PI / 180));
};

// 두 좌표 사이의 거리 계산 (미터)
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const latDistance = (lat2 - lat1) * LATITUDE_DEGREE_DISTANCE;
  const lngDistance = (lng2 - lng1) * getLongitudeDegreeDistance(lat1);
  return Math.sqrt(latDistance * latDistance + lngDistance * lngDistance);
};

// 격자 생성 함수
const createGrid = (map: any, bounds: any, interval: number) => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  const swLat = sw.getLat();
  const swLng = sw.getLng();
  const neLat = ne.getLat();
  const neLng = ne.getLng();

  // 격자 간격을 위도/경도로 변환
  const latSpacing = interval / LATITUDE_DEGREE_DISTANCE;
  const lngSpacing = interval / getLongitudeDegreeDistance(swLat);

  const gridLines = [];

  // 수직선 생성
  for (let lng = swLng; lng <= neLng; lng += lngSpacing) {
    const line = new window.kakao.maps.Polyline({
      path: [
        new window.kakao.maps.LatLng(swLat, lng),
        new window.kakao.maps.LatLng(neLat, lng),
      ],
      strokeColor: "#fff",
      strokeWeight: 2,
      strokeOpacity: 0.75,
      strokeStyle: "solid",
    });
    line.setMap(map);
    gridLines.push(line);
  }

  // 수평선 생성
  for (let lat = swLat; lat <= neLat; lat += latSpacing) {
    const line = new window.kakao.maps.Polyline({
      path: [
        new window.kakao.maps.LatLng(lat, swLng),
        new window.kakao.maps.LatLng(lat, neLng),
      ],
      strokeColor: "#fff",
      strokeWeight: 2,
      strokeOpacity: 0.75,
      strokeStyle: "solid",
    });
    line.setMap(map);
    gridLines.push(line);
  }
  console.log(map);
  return gridLines;
};

export const useMapDrawing = (mapInstanceRef: React.RefObject<any>) => {
  const { isDrawing } = useIsDrawingStore();
  const { drawingState, setDrawingState } = useDrawingStateStore();
  const { addDrawedLine, removeLastDrawedLine } = useDrawedLineStore();
  const { gridInterval } = useGridModeStore();

  const polylineRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const mouseMoveListenerRef = useRef<any>(null);
  const gridLinesRef = useRef<any[]>([]);

  // 격자 제거 함수
  const removeGrid = () => {
    gridLinesRef.current.forEach((line) => line.setMap(null));
    gridLinesRef.current = [];
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    const handleMapClick = (mouseEvent: { latLng: any }) => {
      if (!isDrawing) return;

      const latlng = mouseEvent.latLng;

      // 첫 번째 점을 클릭했을 때
      if (!polylineRef.current && !polygonRef.current) {
        if (drawingState === DrawingState.LINE) {
          // 선 그리기
          polylineRef.current = new window.kakao.maps.Polyline({
            path: [latlng],
            strokeColor: "#39f",
            strokeWeight: 3,
            strokeOpacity: 0.8,
            strokeStyle: "solid",
          });
          polylineRef.current.setMap(map);

          // 마우스 이동 이벤트 리스너 추가
          const handleMouseMove = (e: any) => {
            const path = polylineRef.current.getPath();
            const startPoint = path[0];
            const endPoint = e.latLng;
            polylineRef.current.setPath([startPoint, endPoint]);
          };

          mouseMoveListenerRef.current = handleMouseMove;
          window.kakao.maps.event.addListener(
            map,
            "mousemove",
            handleMouseMove
          );
        } else if (drawingState === DrawingState.RECTANGLE) {
          // 사각형 그리기
          polygonRef.current = new window.kakao.maps.Polygon({
            path: [latlng],
            strokeColor: "#39f",
            strokeWeight: 3,
            strokeOpacity: 0.8,
          });
          polygonRef.current.setMap(map);

          // 마우스 이동 이벤트 리스너 추가
          const handleMouseMove = (e: any) => {
            const startPoint = polygonRef.current.getPath()[0];
            const endPoint = e.latLng;

            // 사각형의 네 꼭지점 계산
            const path = [
              startPoint,
              new window.kakao.maps.LatLng(
                startPoint.getLat(),
                endPoint.getLng()
              ),
              endPoint,
              new window.kakao.maps.LatLng(
                endPoint.getLat(),
                startPoint.getLng()
              ),
            ];

            polygonRef.current.setPath(path);
          };

          mouseMoveListenerRef.current = handleMouseMove;
          window.kakao.maps.event.addListener(
            map,
            "mousemove",
            handleMouseMove
          );
        }
      } else {
        // 두 번째 점을 클릭했을 때
        if (drawingState === DrawingState.LINE && polylineRef.current) {
          const path = polylineRef.current.getPath();
          const startPoint = path[0];
          const endPoint = mouseEvent.latLng;
          polylineRef.current.setPath([startPoint, endPoint]);
          addDrawedLine({ line: polylineRef.current });
          polylineRef.current = null;
        } else if (
          drawingState === DrawingState.RECTANGLE &&
          polygonRef.current
        ) {
          const startPoint = polygonRef.current.getPath()[0];
          const endPoint = mouseEvent.latLng;

          // 사각형의 네 꼭지점 계산
          const path = [
            startPoint,
            new window.kakao.maps.LatLng(
              startPoint.getLat(),
              endPoint.getLng()
            ),
            endPoint,
            new window.kakao.maps.LatLng(
              endPoint.getLat(),
              startPoint.getLng()
            ),
          ];

          polygonRef.current.setPath(path);

          // 격자 생성
          const bounds = new window.kakao.maps.LatLngBounds();
          console.log(bounds);
          path.forEach((latlng: any) => bounds.extend(latlng));

          // 새로운 격자 생성
          const gridLines = createGrid(map, bounds, gridInterval);
          gridLinesRef.current = gridLines;

          addDrawedLine({
            line: polygonRef.current,
            gridLines: gridLinesRef.current,
          });

          polygonRef.current = null;
        }

        // 마우스 이동 이벤트 리스너 제거
        if (mouseMoveListenerRef.current) {
          window.kakao.maps.event.removeListener(
            map,
            "mousemove",
            mouseMoveListenerRef.current
          );
          mouseMoveListenerRef.current = null;
        }
      }
    };

    // 이벤트 리스너 등록
    window.kakao.maps.event.addListener(map, "click", handleMapClick);

    // cleanup 함수
    return () => {
      window.kakao.maps.event.removeListener(map, "click", handleMapClick);
      if (mouseMoveListenerRef.current) {
        window.kakao.maps.event.removeListener(
          map,
          "mousemove",
          mouseMoveListenerRef.current
        );
      }
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
      // 격자 제거는 컴포넌트가 언마운트될 때만 실행
      if (!mapInstanceRef.current) {
        gridLinesRef.current.forEach((line) => line.setMap(null));
        gridLinesRef.current = [];
      }
    };
  }, [isDrawing, drawingState, mapInstanceRef.current, gridInterval]);
};
