import { createRoot } from "react-dom/client";
import App from "./App";
import { StrictMode } from "react";
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePageLayout";
import { PlanPage } from "./pages/PlansPage";
import { TransactionsPage } from "./App";
import { ProtectedRoute } from "./ProtectedRoute";
import { MonthlyPlans } from "./pages/MonthlyPlans";
import { DailyPlans } from "./pages/DailyPlans";
import { BudgetPage } from "./pages/BudgetPage";
import NotFoundPage from "./pages/NotFoundPage";
import "/styles.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />, //Could change to login/signup page or get started page
        children: [
            {path: "/", element: <HomePage/>},
            {   path: "/plans", 
                element: <PlanPage/>,
                children: [
                    {path: "/plans/monthly", element: <MonthlyPlans/>},
                    {path: "/plans/daily", element: <DailyPlans/>}
                ]
            },
            {
                path: "/transactions", 
                element: (
                <ProtectedRoute>
                    <TransactionsPage/>
                </ProtectedRoute>
                ),
            },
            {
                path: "/budget",
                element: (
                    <ProtectedRoute>
                        <BudgetPage/>
                    </ProtectedRoute>
                )
            }

        ]
    },
    {   path: "/plans", 
            element: <PlanPage/>,
            children: [
                {path: "/plans/monthly", element: <MonthlyPlans/>},
                {path: "/plans/daily", element: <DailyPlans/>}
            ]
    },
    {path: "/transactions", element: (<ProtectedRoute><TransactionsPage/></ProtectedRoute>)},
    {path: "/budget", element: (<ProtectedRoute><BudgetPage/></ProtectedRoute>)},
    {path: "*", element: <NotFoundPage/>},
])

const root = createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>
);
root.render(<App />);
