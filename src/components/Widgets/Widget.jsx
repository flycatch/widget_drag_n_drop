import { useDrag } from "react-dnd";

const Widget = ({ widget, className }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "div",
    item: { id: widget.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={className}
      style={isDragging ? { backgroundColor: "greenyellow" } : {}}
    >
      {widget.item}
    </div>
  );
};

export default Widget;
