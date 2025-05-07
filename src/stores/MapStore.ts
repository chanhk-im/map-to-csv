import { create } from "zustand";

interface MapStore {
  map: any | null;
  setMap: (map: any) => void;
  moveMap: (lat: number, lng: number) => void;
  showBoundary: (
    geojson: any,
    cityName: string,
    districtName: string,
    neighborhoodName?: string
  ) => void;
  clearBoundary: () => void;
}

// 현재 표시된 경계선을 추적하기 위한 변수
let currentBoundary: any = null;

export const useMapStore = create<MapStore>((set, get) => ({
  map: null,
  setMap: (map: any) => set({ map: map }),
  moveMap: (lat: number, lng: number) => {
    const map = get().map;
    if (map) {
      const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
      map.setCenter(moveLatLng);
      map.setLevel(4);
    }
  },
  showBoundary: (
    geojson: any,
    cityName: string,
    districtName: string,
    neighborhoodName?: string
  ) => {
    const map = get().map;
    if (!map) return;

    // 기존 경계선 제거
    get().clearBoundary();

    // 검색한 지역의 feature 찾기
    const feature = geojson.features.find((f: any) => {
      const addName = f.properties.adm_nm;

      // 읍/면/동이 있는 경우
      if (neighborhoodName && addName) {
        return (
          addName.includes(cityName) &&
          addName.includes(districtName) &&
          addName.includes(neighborhoodName)
        );
      }
      // 시/도와 구/군만 있는 경우
      return addName.includes(cityName) && addName.includes(districtName);
    });

    if (!feature) {
      console.error("해당 지역의 경계선 데이터를 찾을 수 없습니다.");
      return;
    }

    // 경계선 좌표 배열 생성
    const coordinates = feature.geometry.coordinates[0][0];
    console.log(coordinates);
    const path = coordinates.map((coord: number[]) => {
      console.log(coord[1]);
      return new window.kakao.maps.LatLng(coord[1], coord[0]);
    });
    console.log(path);

    // 경계선 스타일 설정
    const polyline = new window.kakao.maps.Polyline({
      path: path,
      strokeColor: "#FF0000",
      strokeWeight: 2,
      strokeOpacity: 0.8,
      strokeStyle: "solid",
    });

    // 경계선 영역 채우기
    const polygon = new window.kakao.maps.Polygon({
      path: path,
      strokeColor: "#FF0000",
      strokeWeight: 2,
      strokeOpacity: 0.8,
      fillColor: "#FF0000",
      fillOpacity: 0.2,
    });

    // 지도에 표시
    polyline.setMap(map);
    polygon.setMap(map);

    // 현재 경계선 저장
    currentBoundary = { polyline, polygon };

    // 경계선이 모두 보이도록 지도 이동
    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach((latlng: any) => bounds.extend(latlng));
    map.setBounds(bounds);
  },
  clearBoundary: () => {
    if (currentBoundary) {
      currentBoundary.polyline.setMap(null);
      currentBoundary.polygon.setMap(null);
      currentBoundary = null;
    }
  },
}));
