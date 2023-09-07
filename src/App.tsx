import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { PiupiuRoutes } from "./routes/PiupiuRoutes";

function App() {
  return (

    <AuthProvider>
      <PiupiuRoutes />
    </AuthProvider>
  );
}

export default App;
