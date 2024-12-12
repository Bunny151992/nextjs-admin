import Sidebar from "@/app/component/sidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex flex-col lg:flex-row h-screen bg-[#fff]">
            <Sidebar />
            <div className="flex-1 px-8 py-10 overflow-y-scroll newscroller">
                {children}
            </div>
        </div>
    )
}