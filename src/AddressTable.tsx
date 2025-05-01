import React, { use } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "./AddressTable.css";
import { useAddressStore } from "./stores/AddressStore";

export default function AddressTable() {
  const { addressList, removeAddress } = useAddressStore();
  return (
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
                  id={String(index)}
                  variant="danger"
                  size="sm"
                  onClick={() => removeAddress(index)}
                >
                  삭제
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
