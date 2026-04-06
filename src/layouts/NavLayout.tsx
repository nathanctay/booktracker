import { Link, NavLink, Outlet } from "react-router"

function NavLayout() {
    return (
        <div className="flex h-screen w-full">
            <div className="left-side bg-blue-400 w-[100px] sm:w-[400px] p-2">
                <ul className="navList flex flex-col gap-5 list-none text-xl font-bold">
                    <NavLink to={"/"} className={({ isActive }) =>
                        [
                            isActive ? "bg-blue-300" : "",
                        ].join(" ")
                    }>
                        <li className="justify-center sm:justify-start">
                            <svg className="w-9 sm:w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg>
                            <span className="hidden sm:inline">Home</span>
                        </li>
                    </NavLink>
                    <NavLink to={"/search"} className={({ isActive }) =>
                        [
                            isActive ? "bg-blue-300" : "",
                        ].join(" ")
                    }>
                        <li className="justify-center sm:justify-start">
                            <svg className="w-9 sm:w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                            <span className="hidden sm:inline">Search</span>
                        </li>
                    </NavLink>
                    <NavLink to={"/lists"} className={({ isActive }) =>
                        [
                            isActive ? "bg-blue-300" : "",
                        ].join(" ")
                    }>
                        <li className="justify-center sm:justify-start">
                            <svg className="w-9 sm:w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M80-160v-160h160v160H80Zm240 0v-160h560v160H320ZM80-400v-160h160v160H80Zm240 0v-160h560v160H320ZM80-640v-160h160v160H80Zm240 0v-160h560v160H320Z" /></svg>
                            <span className="hidden sm:inline">Lists</span>
                        </li>
                    </NavLink>
                </ul>

            </div>
            <div className="right-side w-full p-4">
                <Outlet />
            </div>
        </div>
    )
}
export default NavLayout