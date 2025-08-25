import { Button } from '@/components/ui/button';
import ThemeContext from '@/utils/ThemeContext';
import React, { useContext } from 'react'

const WaitForApprove = () => {
    const { user } = useContext(ThemeContext)
    const isAdmin = user.status === 'admin' ? true : false
    const handleNavigation = (path) => {
        console.log(path)
        if (path === 'logout') {
            localStorage.clear();
            window.location.href = "/login";
        }
        window.location.href = path;
    };
    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="text-center mx-3">
                <h1 className="text-4xl font-bold text-green-600 mb-4">
                    รอการอนุญาติเข้าใช้งาน
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    ระบบกำลังรอการอนุญาติเพื่อให้คุณสามารถบันทึกการปลูกเมล่อนได้
                </p>
                <div className='flex justify-center'>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid"></div>
                </div>
                <p className="text-gray-600 mt-4 mb-6">
                    กรุณารอสักครู่...
                </p>
                <Button className="bg-green-600" onClick={(e => handleNavigation('logout'))}>กลับไปล็อกอิน</Button>
            </div>
        </div>
    )
}

export default WaitForApprove