import { useCallback, useEffect, useState } from "react";
import Widget from "../Widgets/Widget";
import { useDrop } from "react-dnd";
import "./dragDrop.css";
import WidgetElement from "../Widgets/WidgetElement";

const WIDGET_LIST = [
  {
    id: 1,
    item: "Text Input",
    type: "input",
  },
  {
    id: 2,
    item: "Button",
    type: "button",
  },
  {
    id: 3,
    item: "Image upload",
    type: "file",
  },
  {
    id: 4,
    item: "Table",
    type: "table",
  },
];

const LOCAL_STORAGE_KEY = "canvasWidgets";
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(canvasList));
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
    };
    setCanvasList((prevCanvasList) => {
      const updatedList = [...prevCanvasList, newWidget];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
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
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    });
  };

  const removeWidget = (widgetId) => {
    setCanvasList((prevCanvasList) => {
      const updatedList = prevCanvasList.filter(
        (widget) => widget.id !== widgetId
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
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
