import { Navigate, NavLink, Outlet } from "react-router"
import { signOut, useSession } from "../utils/auth-client"

function ProtectedLayout() {
    const { data: session, isPending } = useSession()

    // Show loading spinner
    // if (isPending) return <Spinner />
    if (!isPending && !session) return <Navigate to={'/login'} replace />

    return (
        <div className="flex h-screen w-full">
            <div className="sidebar bg-blue-400 w-[100px] md:w-[300px] p-[16px] text-white flex flex-col gap-[50px]">
                <div className="logo flex gap-[20px] items-center justify-center md:justify-start">
                    <svg className="h-[48px] fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <title>view-dashboard</title>
                        <path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z" />
                    </svg>
                    <h2 className="hidden md:inline">BookNook</h2>
                </div>
                <ul className="navList flex flex-col gap-[10px] list-none text-xl font-bold p-[5px] flex-1">
                    <NavLink to={"/"} className={({ isActive }) =>
                        [
                            isActive ? "bg-blue-300" : "",
                        ].join(" ")
                    }>
                        <li className="navbar-button justify-center md:justify-start">
                            <svg className="w-9 md:w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg>
                            <span className="hidden md:inline">Home</span>
                        </li>
                    </NavLink>
                    <NavLink to={"/search"} className={({ isActive }) =>
                        [
                            isActive ? "bg-blue-300" : "",
                        ].join(" ")
                    }>
                        <li className="navbar-button justify-center md:justify-start">
                            <svg className="w-9 md:w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
                            <span className="hidden md:inline">Search</span>
                        </li>
                    </NavLink>
                    <NavLink to={"/lists"} className={({ isActive }) =>
                        [
                            isActive ? "bg-blue-300" : "",
                        ].join(" ")
                    }>
                        <li className="navbar-button justify-center md:justify-start">
                            <svg className="w-9 md:w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M80-160v-160h160v160H80Zm240 0v-160h560v160H320ZM80-400v-160h160v160H80Zm240 0v-160h560v160H320ZM80-640v-160h160v160H80Zm240 0v-160h560v160H320Z" /></svg>
                            <span className="hidden md:inline">Lists</span>
                        </li>
                    </NavLink>
                </ul>
                <div className="navbar-button p-[5px] hover:cursor-pointer h-[50px]" onClick={() => signOut()}>
                    <svg className="w-9 md:w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg>
                    <span className="hidden md:inline">Sign Out</span>
                </div>

            </div>
            <div className="content overflow-auto flex-1 px-[24px] py-[48px]">
                <Outlet />
            </div>
        </div>
    )
}
export default ProtectedLayout

