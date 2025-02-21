import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import dragIcon from "../../assets/dragIcon.svg";
import deleteIcon from "../../assets/deleteIcon.svg";
import "./widget.css";

const WidgetElement = ({
  id,
  index,
  widget,
  className,
  moveElement,
  removeWidget,
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

  const handleInputChange = (e) => {
    updateWidgetValue(id, e.target.value);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      const updatedCanvasList = canvasList.map((item) =>
        item.id === widget.id ? { ...item, fileURL } : item
      );
      setCanvasList(updatedCanvasList);
      localStorage.setItem("canvasWidgets", JSON.stringify(updatedCanvasList));
    }
  };
  const handleButtonClick = () => {
    alert(`You have clicked a Button at position ${index + 1}.`);
  };

  const renderElement = (type, className) => {
    switch (type) {
      case "input":
        return (
          <input
            type="text"
            className={className}
            value={widget.value || ""}
            onChange={handleInputChange}
          />
        );
      case "button":
        return (
          <button className={className} onClick={handleButtonClick}>
            Submit
          </button>
        );
      case "file":
        return (
          <div className="image_upload_wrap">
            <input
              type="file"
              className={className}
              onChange={handleFileChange}
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
        return <div className={className}>Table Component</div>;
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
      {renderElement(widget.type, widget.className)}
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
