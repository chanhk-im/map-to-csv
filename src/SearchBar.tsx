import React, { useState, useEffect } from "react";
import "./SearchBar.css";
import { useMapStore } from "./stores/MapStore";

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const { moveMap, showBoundary, clearBoundary } = useMapStore();

  // GeoJSON 데이터 로드
  useEffect(() => {
    const loadGeojson = async () => {
      try {
        const response = await fetch("/map-to-csv/regions.geojson");
        if (response.ok) {
          const data = await response.json();
          setGeojsonData(data);
        } else {
          console.error("GeoJSON 데이터를 가져올 수 없습니다.");
        }
      } catch (error) {
        console.error("GeoJSON 데이터 로딩 중 오류 발생:", error);
      }
    };

    loadGeojson();
  }, []);

  const handleSearch = () => {
    if (!searchValue.trim() || !geojsonData) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(searchValue, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        moveMap(coords.getLat(), coords.getLng());

        // 주소에서 시/도, 구/군, 읍/면/동 이름 추출
        const addressParts = result[0].address_name.split(" ");
        const cityName = addressParts[0]; // 시/도 이름
        const districtName = addressParts[1]; // 구/군 이름
        const neighborhoodName = addressParts[2]; // 읍/면/동 이름 (있는 경우)

        console.log(
          `시/도: ${cityName}, 구/군: ${districtName}, 읍/면/동: ${
            neighborhoodName || "없음"
          }`
        );
        showBoundary(geojsonData, cityName, districtName, neighborhoodName);
      } else {
        alert("검색 결과가 없습니다.");
        clearBoundary();
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
}
