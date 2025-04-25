import { useState, useEffect, useRef } from "react";
import "./MainPage.css";
import excelDownload from "./ExcelUtil";
import Header from "./Header";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

function MainPage() {
  const mapRef = useRef(null);
  const [addressList, setAddressList] = useState([]);
  const overlayIsOpenRef = useRef(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=9ddfb885a3d518940c70b240b52bfefc&libraries=services&autoload=false";
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(35.500701, 129.070667),
          level: 3,
          mapTypeId: window.kakao.maps.MapTypeId.HYBRID,
        };

        const map = new window.kakao.maps.Map(mapContainer, options);
        const geocoder = new window.kakao.maps.services.Geocoder();
        const marker = new window.kakao.maps.Marker();

        window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
          if (overlayIsOpenRef.current) return;
          overlayIsOpenRef.current = true;

          const latlng = mouseEvent.latLng;

          geocoder.coord2Address(
            latlng.getLng(),
            latlng.getLat(),
            function (result, status) {
              if (status === window.kakao.maps.services.Status.OK) {
                const address =
                  result[0].road_address?.address_name ||
                  result[0].address.address_name;
                console.log("클릭한 주소:", address);

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
                      setAddressList((prev) => {
                        if (prev.some((item) => item.address === address))
                          return prev;
                        const newIndex = prev.length + 1;
                        const newAddress = { index: newIndex, address };
                        return [...prev, newAddress];
                      });
                      overlayIsOpenRef.current = false;
                      customOverlay.setMap(null);
                      marker.setMap(null);
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
        });
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <>
      <div className="container">
        <Header />
        <Card className="card">
          <div className="card-title">사용방법</div>
          <div>좌표 찍어서 목록 확인한 다음 다운받으시면 됩니다.</div>
        </Card>
        <div ref={mapRef} className="map"></div>
        <Card className="card">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>순번</th>
                <th>주소</th>
              </tr>
            </thead>
            <tbody>
              {addressList.map((item, index) => (
                <tr key={index}>
                  <td>{item.index}</td>
                  <td>
                    <div className="address-item">
                      {item.address}
                      <Button
                        id={index}
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setAddressList((prev) => {
                            const newList = [...prev];
                            newList.splice(item.index - 1, 1);
                            return newList.map((item, index) => ({
                              ...item,
                              index: index + 1,
                            }));
                          });
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
