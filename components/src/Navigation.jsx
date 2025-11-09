import {NavLink, useNavigate} from "react-router-dom";
import { loadSettings } from "./settings";
export function Navigation () {
    const navigate = useNavigate();
    const settings = loadSettings();

   const handleLogout = () => {
        {/**Remove the game settings from local storage */}
        localStorage.removeItem(`user.settings`);
        {/**Navigate back to the homepage */}
        navigate(`/`);
    };

    return (
        <div class="main-nav">
            <nav>
                <NavLink to="/">Home</NavLink>
                {' | '}
                <NavLink to="/plans">Plans</NavLink>
                {' | '}
                <NavLink to="/transactions">Transactions</NavLink>
                {' | '}
                <NavLink to="/budget">Budget</NavLink>
                {' | '}
                <NavLink to="/create">Create</NavLink>

                {/**Calling both settings and name to be loaded */}
                {settings && settings.name && (
                    <div>
                    <p>Hello, {settings.name}</p>
                    {/**On clicking logout button, handle the logout, clear settings, and redirect to home */}
                    <button onClick={handleLogout}>Logout</button>
                </div>
                )}

            </nav>
        </div>
    )




}