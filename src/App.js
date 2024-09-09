import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import Login from "./Login/index.js";
import Sidebar from "./components/Layouts/Sidebar";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./components/Layouts/RootLayout";
import Patient from "./components/Patient/Patient";
import DialysisSchedule from "./components/Dialysis/DialysisSchedule";
import AddPatient from "./components/Patient/AddPatient";
import EditPatient from "./components/Patient/EditPatient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <AuthProvider>
      <div className="App main-panel wrapper">
        <Routes path="/" element={<RootLayout />}>
          <Route path={"/patient"} element={<Patient />} />
          <Route path={"/dialysis"} element={<DialysisSchedule />} />
          <Route path={"/add-patient"} element={<AddPatient />} />
          <Route path={"/edit-patient"} element={<EditPatient />} />
        </Routes>
        {/* <Login /> */}
        <Sidebar />
        <ToastContainer />
        {/* <Profile /> */}
      </div>
    </AuthProvider>
  );
}

export default App;
