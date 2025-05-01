import XLSX from "xlsx-js-style";

const excelDownload = (data, filename) => {
  const wb = XLSX.utils.book_new();
  const headerStyle = {
    font: {
      bold: true,
      color: { rgb: "000000" },
      name: "함초롱바탕",
      sz: 13,
    },
    fill: { fgColor: { rgb: "BC8F8F" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      left: { style: "thin", color: { auto: 1 } },
      right: { style: "thin", color: { auto: 1 } },
      top: { style: "thin", color: { auto: 1 } },
      bottom: { style: "thin", color: { auto: 1 } },
    },
  };
  const dataStyle = {
    font: { color: { rgb: "000000" }, name: "함초롱바탕", sz: 11 },
    fill: { fgColor: { rgb: "FFFAFA" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      left: { style: "thin", color: { auto: 1 } },
      right: { style: "thin", color: { auto: 1 } },
      top: { style: "thin", color: { auto: 1 } },
      bottom: { style: "thin", color: { auto: 1 } },
    },
  };

  const colWidths = [40, 300];
  const cols = colWidths.map((width) => ({ wpx: width }));

  const row = [
    { v: "순번", t: "s", s: headerStyle },
    { v: "주소", t: "s", s: headerStyle },
  ];

  const dataRows = data.map((item) => {
    return [
      { v: item.index, t: "s", s: dataStyle },
      { v: item.address, t: "s", s: dataStyle },
    ];
  });

  const rows = [row, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(rows, { cellStyles: true });
  ws["!cols"] = cols;

  XLSX.utils.book_append_sheet(wb, ws, "주소리스트");
  XLSX.writeFile(wb, filename, { bookType: "xlsx", type: "binary" });
};

export default excelDownload;
