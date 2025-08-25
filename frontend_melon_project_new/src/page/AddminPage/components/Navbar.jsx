import Logout from '@/page/logout/logout'
import React from 'react'
import { FaCircleArrowLeft } from 'react-icons/fa6'

const Navbar = ({ activeIndex }) => {
    return (
        <div>
            <header className='bg-green_dark text-white px-5 py-4 rounded-b-md flex justify-between'>
                <div className='w-full'>
                    {
                        activeIndex === 0 &&
                        <div className='flex items-center gap-3 justify-between'>
                            หน้าหลัก
                            <Logout />
                        </div> ||
                        activeIndex === 2 &&
                        <div className='flex items-center gap-3 justify-between'>
                            ยืนยันผู้ใช้งาน
                            <Logout />
                        </div> ||
                        activeIndex === 3 &&
                        <div className='flex items-center gap-3 justify-between'>
                            ตั้งค่า
                            <Logout />
                        </div>
                    }
                </div>
            </header>
        </div>
    )
}

export default Navbar