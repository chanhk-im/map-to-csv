import { useIsDrawingStore } from "./stores/SystemStore";

export const selectOverlay = (drawingManager: any) => {
  const store = useIsDrawingStore.getState();
  
  if (drawingManager) {
    drawingManager.select(window.kakao.maps.drawing.OverlayType.POLYLINE);
    console.log(drawingManager);
  }
};

export const cancelDrawing = (drawingManager: any) => {
  if (drawingManager) {
    drawingManager.cancel();
  }
};
