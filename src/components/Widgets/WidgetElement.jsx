import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import dragIcon from "../../assets/dragIcon.svg";
import deleteIcon from "../../assets/deleteIcon.svg";
import editIcon from "../../assets/editIcon.svg";
import "./widget.css";
import {
  handleButtonClick,
  handleFileChange,
  handleInputChange,
  handleLabelChange,
  handleTableChange,
} from "../../utilities/widgetFunction";

const WidgetElement = ({
  id,
  index,
  widget,
  className,
  moveElement,
  removeWidget,
  updateWidget,
  updateWidgetValue,
  canvasList,
  setCanvasList,
}) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "div",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveElement(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: "div",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // const handleInputChange = (e) => {
  //   updateWidgetValue(id, e.target.value);
  // };
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const fileURL = URL.createObjectURL(file);
  //     const updatedCanvasList = canvasList.map((item) =>
  //       item.id === widget.id ? { ...item, fileURL } : item
  //     );
  //     setCanvasList(updatedCanvasList);
  //     saveToLocalStorage(updatedCanvasList);
  //   }
  // };
  // const handleButtonClick = () => {
  //   alert(`You have clicked a Button at position ${index + 1}.`);
  // };
  // const handleLabelChange = () => {
  //   const newLabel = prompt("Enter new button label:", widget.label);
  //   if (newLabel !== null && newLabel.trim() !== "") {
  //     updateWidget(id, { label: newLabel });
  //   }
  // };
  // const handleTableChange = (row, col, value) => {
  //   const updatedTable = widget.tableData.map((item, rowIndex) =>
  //     rowIndex === row
  //       ? item.map((cell, colIndex) => (colIndex === col ? value : cell))
  //       : item
  //   );
  //   updateWidget(id, { tableData: updatedTable });
  // };

  const renderElement = (type, className, label, tableData) => {
    switch (type) {
      case "input":
        return (
          <input
            type="text"
            placeholder="Type here"
            className={className}
            value={widget.value || ""}
            onChange={(e) => handleInputChange(e, id, updateWidgetValue)}
          />
        );
      case "button":
        return (
          <div className="widget_btn_wrap">
            <button
              className={`${className} widget_btn`}
              onClick={() => handleButtonClick(index)}
            >
              {label}
            </button>
            <img
              src={editIcon}
              onClick={() => handleLabelChange(widget, id, updateWidget)}
              className="widget_edit"
            />
          </div>
        );
      case "file":
        return (
          <div className="image_upload_wrap">
            <input
              type="file"
              className={className}
              onChange={(e) =>
                handleFileChange(e, widget, canvasList, setCanvasList)
              }
            />
            {widget.fileURL && (
              <img
                src={widget.fileURL}
                alt="Uploaded"
                className="uploaded_image"
              />
            )}
          </div>
        );
      case "table":
        return (
          <table className={`${className} widget_table`} border="1">
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="table_data">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          handleTableChange(
                            widget,
                            id,
                            rowIndex,
                            colIndex,
                            e.target.value,
                            updateWidget
                          )
                        }
                        className="table_input"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return <div className={className}>Unknown Widget</div>;
    }
  };

  return (
    <div
      ref={preview}
      data-handler-id={handlerId}
      className={className}
      style={isDragging ? { backgroundColor: "greenyellow" } : {}}
    >
      {renderElement(
        widget.type,
        widget.className,
        widget.label,
        widget.tableData
      )}
      <img src={dragIcon} ref={ref} className="widget_handle" />
      <img
        src={deleteIcon}
        onClick={() => removeWidget(id)}
        className="widget_delete"
      />
    </div>
  );
};

export default WidgetElement;
