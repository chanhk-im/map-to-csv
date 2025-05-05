export var drawingManagerOptions = {
  // Drawing Manager를 생성할 때 사용할 옵션입니다
  // 사용자에게 제공할 그리기 가이드 툴팁입니다
  // 사용자에게 도형을 그릴때, 드래그할때, 수정할때 가이드 툴팁을 표시하도록 설정합니다
  guideTooltip: ["draw", "drag", "edit"],
  markerOptions: {
    // 마커 옵션입니다
    draggable: true, // 마커를 그리고 나서 드래그 가능하게 합니다
    removable: true, // 마커를 삭제 할 수 있도록 x 버튼이 표시됩니다
  },
  polylineOptions: {
    // 선 옵션입니다
    draggable: true, // 그린 후 드래그가 가능하도록 설정합니다
    removable: true, // 그린 후 삭제 할 수 있도록 x 버튼이 표시됩니다
    editable: true, // 그린 후 수정할 수 있도록 설정합니다
    strokeColor: "#39f", // 선 색
    hintStrokeStyle: "dash", // 그리중 마우스를 따라다니는 보조선의 선 스타일
    hintStrokeOpacity: 0.5, // 그리중 마우스를 따라다니는 보조선의 투명도
  },
  rectangleOptions: {
    draggable: true,
    removable: true,
    editable: true,
    strokeColor: "#39f", // 외곽선 색
    fillColor: "#39f", // 채우기 색
    fillOpacity: 0.5, // 채우기색 투명도
  },
  circleOptions: {
    draggable: true,
    removable: true,
    editable: true,
    strokeColor: "#39f",
    fillColor: "#39f",
    fillOpacity: 0.5,
  },
  polygonOptions: {
    draggable: true,
    removable: true,
    editable: true,
    strokeColor: "#39f",
    fillColor: "#39f",
    fillOpacity: 0.5,
    hintStrokeStyle: "dash",
    hintStrokeOpacity: 0.5,
  },
};
