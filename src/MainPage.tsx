import { useEffect, useRef } from "react";
import "./MainPage.css";
import excelDownload from "./ExcelUtil";
import Header from "./Header";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import AddressTable from "./AddressTable";
import useKakaoMap from "./hooks/useKakaoMap";
import React from "react";
import { useAddressStore } from "./stores/AddressStore";
import { useIsDrawingStore, useDrawingStateStore } from "./stores/SystemStore";
import SearchBar from "./SearchBar";
import { useDrawedLineStore } from "./stores/DrawedLineStore";
import { DrawingState } from "./options/DrawingState";
import { useGridModeStore } from "./stores/SystemStore";

function MainPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { addressList } = useAddressStore();
  const { isDrawing, setIsDrawing } = useIsDrawingStore();
  const { drawingState, setDrawingState } = useDrawingStateStore();
  const { drawedLines, removeLastDrawedLine } = useDrawedLineStore();
  const { gridInterval, setGridInterval } = useGridModeStore();

  useKakaoMap(mapRef as React.RefObject<HTMLDivElement>);

  function DownloadButton() {
    return (
      <Button
        variant="primary"
        onClick={() => {
          excelDownload(addressList, "주소리스트.xlsx");
        }}
      >
        엑셀 파일 다운로드
      </Button>
    );
  }

  function DrawingButtons() {
    if (!isDrawing) {
      return (
        <div className="drawing-buttons">
          <Button
            variant="primary"
            onClick={() => {
              setIsDrawing(true);
              setDrawingState(DrawingState.LINE);
            }}
          >
            선 그리기
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setIsDrawing(true);
              setDrawingState(DrawingState.RECTANGLE);
            }}
          >
            사각형 그리기
          </Button>
        </div>
      );
    } else {
      return (
        <Button
          variant="primary"
          onClick={() => {
            setIsDrawing(false);
            setDrawingState(DrawingState.NONE);
          }}
        >
          취소
        </Button>
      );
    }
  }

  return (
    <>
      <div className="main-container">
        <Header />
        {/* <Card className="card">
          <div className="card-title">사용방법</div>
          <div>
            좌표 찍어서 목록 확인한 다음 다운받으시면 됩니다.
            <br /> 선 그릴 때는 마지막 점을 다시 클릭하면 선이 완성됩니다.
            <br /> 사각형은 두 점을 클릭하여 그릴 수 있습니다.
            <br />
            <br /> * 일부 지역 경계선 표시 안되는 문제 해결
            <br /> * 격자 간격 조절 가능
          </div>
        </Card> */}
        <SearchBar />
        <div className="grid-interval-container">
          <div>격자 간격</div>
          <input
            type="number"
            value={gridInterval}
            onChange={(e) => setGridInterval(Number(e.target.value))}
          />
        </div>
        <div ref={mapRef} className="map"></div>
        <DrawingButtons />
        {drawedLines.length > 0 && (
          <Button
            variant="primary"
            onClick={() => {
              if (drawedLines.length > 0) {
                const lastLine = drawedLines[drawedLines.length - 1];
                console.log(lastLine);
                lastLine.line.setMap(null);
                if (lastLine.gridLines) {
                  lastLine.gridLines.forEach((line: any) => line.setMap(null));
                }
                removeLastDrawedLine();
              }
            }}
          >
            마지막 도형 제거
          </Button>
        )}
        <DownloadButton />
        <Card className="card">
          <AddressTable />
        </Card>
      </div>
    </>
  );
}

export default MainPage;
