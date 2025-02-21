import { useCallback, useEffect, useState } from "react";
import Widget from "../Widgets/Widget";
import { useDrop } from "react-dnd";
import "./dragDrop.css";
import WidgetElement from "../Widgets/WidgetElement";
import { WIDGET_LIST } from "../../constants/DragNDropConstants";
import { LOCAL_STORAGE_KEY } from "../../constants/StorageConstant";
import { saveToLocalStorage } from "../../utilities/dragNDropFunctions";

const DragNDrop = () => {
  const [canvasList, setCanvasList] = useState(() => {
    try {
      const savedCanvas = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedCanvas
        ? JSON.parse(savedCanvas).map((widget) => ({
            ...widget,
            fileURL: widget.fileURL || null,
          }))
        : [];
    } catch (error) {
      console.error("Error loading canvasList:", error);
      return [];
    }
  });

  useEffect(() => {
    saveToLocalStorage(canvasList);
  }, [canvasList]);

  const [, drop] = useDrop(() => ({
    accept: "div",
    drop: (item) => addItemToCanvas(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addItemToCanvas = (itemId) => {
    const selectedWidget = WIDGET_LIST.find((widget) => widget.id === itemId);
    if (!selectedWidget) return;
    const newWidget = {
      id: Date.now(),
      type: selectedWidget.type,
      className: "widget_element",
      value: "",
      label: selectedWidget.type === "button" ? "Button label" : "",
      tableData:
        selectedWidget.type === "table"
          ? Array.from({ length: 3 }, () => Array(4).fill(""))
          : undefined,
    };
    setCanvasList((prevCanvasList) => {
      const updatedList = [...prevCanvasList, newWidget];
      saveToLocalStorage(updatedList);
      return updatedList;
    });
  };

  const moveElement = useCallback((dragIndex, hoverIndex) => {
    setCanvasList((prevCanvasList) => {
      const updatedCanvasList = [...prevCanvasList];
      const [draggedItem] = updatedCanvasList.splice(dragIndex, 1);
      updatedCanvasList.splice(hoverIndex, 0, draggedItem);
      return updatedCanvasList;
    });
  }, []);

  const updateWidgetValue = (id, newValue) => {
    setCanvasList((prevCanvasList) => {
      const updatedList = prevCanvasList.map((widget) =>
        widget.id === id ? { ...widget, value: newValue } : widget
      );
      saveToLocalStorage(updatedList);
      return updatedList;
    });
  };

  const removeWidget = (widgetId) => {
    setCanvasList((prevCanvasList) => {
      const updatedList = prevCanvasList.filter(
        (widget) => widget.id !== widgetId
      );
      saveToLocalStorage(updatedList);
      return updatedList;
    });
  };

  const updateWidget = (id, updatedProperties) => {
    setCanvasList((prevCanvasList) => {
      const updatedList = prevCanvasList.map((widget) =>
        widget.id === id ? { ...widget, ...updatedProperties } : widget
      );
      saveToLocalStorage(updatedList);
      return updatedList;
    });
  };

  console.log("canvasList: ", canvasList);

  return (
    <div className="dragNDrop_container">
      <div className="widgets_container">
        {WIDGET_LIST.map((widget) => (
          <Widget key={widget.id} widget={widget} className={"widgets"} />
        ))}
      </div>
      <div className="canvas_container" ref={drop}>
        <div className="scroll_container">
          {canvasList.length ? (
            canvasList.map((items, index) => (
              <WidgetElement
                key={items.id}
                id={items.id}
                index={index}
                widget={items}
                className={"canvas_items"}
                moveElement={moveElement}
                removeWidget={removeWidget}
                updateWidget={updateWidget}
                updateWidgetValue={updateWidgetValue}
                canvasList={canvasList}
                setCanvasList={setCanvasList}
              />
            ))
          ) : (
            <span>Drop widgets here</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DragNDrop;
