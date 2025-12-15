import * as fs from "fs";
import * as path from "path";

// GeoJSON 파일을 읽어서 JSON으로 변환하는 함수
function convertGeoJsonToJson(inputPath: string, outputPath: string): void {
  try {
    // GeoJSON 파일 읽기
    const geoJsonData = fs.readFileSync(inputPath, "utf-8");
    const geoJson = JSON.parse(geoJsonData);

    // JSON 파일로 저장
    fs.writeFileSync(outputPath, JSON.stringify(geoJson, null, 2), "utf-8");
    console.log(
      `변환이 완료되었습니다. 결과가 ${outputPath}에 저장되었습니다.`
    );
  } catch (error) {
    console.error("오류가 발생했습니다:", error);
  }
}

// 실행 예시
const inputFile = path.join(__dirname, "../public/regions.geojson");
const outputFile = path.join(__dirname, "../public/regions.json");

convertGeoJsonToJson(inputFile, outputFile);
