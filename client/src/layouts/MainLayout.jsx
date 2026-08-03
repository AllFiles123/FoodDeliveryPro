import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >
      <Outlet />
    </div>
  );
}