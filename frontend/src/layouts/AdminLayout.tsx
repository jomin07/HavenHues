import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface Props {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) =>{
    const [ isSidebarVisible,setSidebarVisible ] = useState(true);

    const toggleSidebar = () =>{
        setSidebarVisible(!isSidebarVisible);
    }

    return(
        <div className="flex flex-col min-h-screen">
            <Sidebar isVisible={isSidebarVisible}/>
            <div className={`flex-1 ${isSidebarVisible ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
                <Navbar toggleSidebar={toggleSidebar}/>
            </div>
            <div className="p-4">
                {children}
            </div>
            
        </div>
    );
}

export default AdminLayout;