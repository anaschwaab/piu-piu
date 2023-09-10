import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { PiupiuRoutes } from "./routes/PiupiuRoutes";
import queryClient from "./service/queryClient";

function App() {
  return (

    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <PiupiuRoutes />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
