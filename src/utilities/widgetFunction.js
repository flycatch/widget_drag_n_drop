import { saveToLocalStorage } from "./dragNDropFunctions";

export const handleTableChange = (
  widget,
  id,
  row,
  col,
  value,
  updateWidget
) => {
  const updatedTable = widget.tableData.map((item, rowIndex) =>
    rowIndex === row
      ? item.map((cell, colIndex) => (colIndex === col ? value : cell))
      : item
  );
  updateWidget(id, { tableData: updatedTable });
};

export const handleLabelChange = (widget, id, updateWidget) => {
  const newLabel = prompt("Enter new button label:", widget.label);
  if (newLabel !== null && newLabel.trim() !== "") {
    updateWidget(id, { label: newLabel });
  }
};

export const handleButtonClick = (index) => {
  alert(`You have clicked a Button at position ${index + 1}.`);
};

export const handleFileChange = (event, widget, canvasList, setCanvasList) => {
  const file = event.target.files[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    const updatedCanvasList = canvasList.map((item) =>
      item.id === widget.id ? { ...item, fileURL } : item
    );
    setCanvasList(updatedCanvasList);
    saveToLocalStorage(updatedCanvasList);
  }
};

export const handleInputChange = (e, id, updateWidgetValue) => {
  updateWidgetValue(id, e.target.value);
};
