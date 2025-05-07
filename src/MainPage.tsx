import { useEffect, useRef } from "react";
import "./MainPage.css";
import excelDownload from "./ExcelUtil";
import Header from "./Header";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import AddressTable from "./AddressTable";
import useKakaoMap from "./useKakaoMap";
import React from "react";
import { useAddressStore } from "./stores/AddressStore";
import { useDrawingManagerStore } from "./stores/DrawingManagerStore";
import { selectOverlay, cancelDrawing } from "./DrawingTools";
import { useMapStore } from "./stores/MapStore";
import { useIsDrawingStore } from "./stores/SystemStore";
import SearchBar from "./SearchBar";

function MainPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { addressList } = useAddressStore();
  const { isDrawing, setIsDrawing } = useIsDrawingStore();
  const { drawingManager } = useDrawingManagerStore();

  useKakaoMap(mapRef as React.RefObject<HTMLDivElement>);

  function DrawButton() {
    if (!isDrawing) {
      return (
        <Button
          variant="primary"
          onClick={() => {
            if (drawingManager) {
              setIsDrawing(true);
              selectOverlay(drawingManager);
            }
          }}
        >
          선 그리기
        </Button>
      );
    } else {
      return (
        <Button
          variant="primary"
          onClick={() => {
            if (drawingManager) {
              setIsDrawing(false);
              cancelDrawing(drawingManager);
            }
          }}
        >
          취소
        </Button>
      );
    }
  }

  return (
    <>
      <div className="container">
        <Header />
        <Card className="card">
          <div className="card-title">사용방법</div>
          <div>좌표 찍어서 목록 확인한 다음 다운받으시면 됩니다.</div>
        </Card>
        <SearchBar />
        <div ref={mapRef} className="map"></div>
        <DrawButton />
        <Card className="card">
          <AddressTable />
        </Card>
        <Button
          variant="primary"
          onClick={() => {
            excelDownload(addressList, "주소리스트.xlsx");
          }}
        >
          엑셀 파일 다운로드
        </Button>
      </div>
    </>
  );
}

export default MainPage;
