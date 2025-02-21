import { useCallback, useState } from "react";
import Widget from "../Widgets/Widget";
import { useDrop } from "react-dnd";
import "./dragDrop.css";
import WidgetElement from "../Widgets/WidgetElement";

const WIDGET_LIST = [
  {
    id: 1,
    item: "Text Input",
    element: <input type="text" className="widget_element" />,
  },
  {
    id: 2,
    item: "Button",
    element: <button className="widget_element">Submit</button>,
  },
  {
    id: 3,
    item: "Image upload",
    element: <input type="file" className="widget_element" />,
  },
  {
    id: 4,
    item: "Table",
  },
];
const DragNDrop = () => {
  const [canvasList, setCanvasList] = useState([]);

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
    const newWidget = { ...selectedWidget, id: Date.now() };
    setCanvasList((prevCanvasList) => [...prevCanvasList, newWidget]);
  };

  const moveElement = useCallback((dragIndex, hoverIndex) => {
    setCanvasList((prevCanvasList) => {
      const updatedCanvasList = [...prevCanvasList];
      const [draggedItem] = updatedCanvasList.splice(dragIndex, 1);
      updatedCanvasList.splice(hoverIndex, 0, draggedItem);
      return updatedCanvasList;
    });
  }, []);

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
