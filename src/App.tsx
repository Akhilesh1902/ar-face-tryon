import "./App.css";
import FaceMesh from "./components/Face";

function App() {
  return (
    <>
      <div>
        <h1>Face Try-On App</h1>
        <div className="container">
          <div className="wrapper">
            <div>
              <FaceMesh />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
