import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import StartPage from "./pages/StartPage.jsx";
import BoardPage from "./pages/BoardPage.jsx";
import "./index.css";
import App from "./App.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <StartPage></StartPage>,
  },
  {
    path: "/board/:boardId",
    element: <BoardPage></BoardPage>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
