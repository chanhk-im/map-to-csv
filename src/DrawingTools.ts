import { useIsDrawingStore } from "./stores/SystemStore";

export const selectOverlay = (drawingManager: any) => {
  console.log("selectOverlay called with:", drawingManager);

  if (!drawingManager) {
    console.error("DrawingManager is not initialized");
    return;
  }

  try {
    console.log("Attempting to select POLYLINE overlay...");
    drawingManager.select(window.kakao.maps.drawing.OverlayType.POLYLINE);
    console.log("Successfully selected POLYLINE overlay");
  } catch (error) {
    console.error("Failed to select overlay:", error);
  }
};

export const cancelDrawing = (drawingManager: any) => {
  console.log("cancelDrawing called with:", drawingManager);

  if (!drawingManager) {
    console.error("DrawingManager is not initialized");
    return;
  }

  try {
    console.log("Attempting to cancel drawing...");
    drawingManager.cancel();
    console.log("Successfully cancelled drawing");
  } catch (error) {
    console.error("Failed to cancel drawing:", error);
  }
};
