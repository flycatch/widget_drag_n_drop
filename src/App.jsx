import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragNDrop from "./components/DragNDrop/DragNDrop";
import "./App.css";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragNDrop />
    </DndProvider>
  );
}

export default App;
