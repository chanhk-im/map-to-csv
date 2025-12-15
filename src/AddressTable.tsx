import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "./AddressTable.css";
import { useAddressStore } from "./stores/AddressStore";

export default function AddressTable() {
  const { addressList, removeAddress, moveAddress, editAddress } =
    useAddressStore();
  const [currEditAddress, setCurrEditAddress] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number>(-1);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>순번</th>
          <th>주소</th>
        </tr>
      </thead>
      <tbody>
        {addressList
          .slice(0)
          .reverse()
          .map((item, index) => (
            <tr key={addressList.length - index - 1}>
              <td>{addressList.length - index}</td>
              <td>
                <div className="address-item">
                  {editIndex === addressList.length - index - 1 ? (
                    <input
                      type="text"
                      value={currEditAddress}
                      onChange={(e) => setCurrEditAddress(e.target.value)}
                    />
                  ) : (
                    item.address
                  )}
                  <div className="button-group">
                    {editIndex === addressList.length - index - 1 ? (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          editAddress(
                            addressList.length - index - 1,
                            currEditAddress
                          );
                          setEditIndex(-1);
                        }}
                      >
                        완료
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          setEditIndex(addressList.length - index - 1);
                          setCurrEditAddress(item.address);
                        }}
                      >
                        수정
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() =>
                        moveAddress(addressList.length - index - 1, "up")
                      }
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() =>
                        moveAddress(addressList.length - index - 1, "down")
                      }
                      disabled={index === addressList.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      id={String(addressList.length - index - 1)}
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        item.marker.setMap(null);
                        removeAddress(addressList.length - index - 1);
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
