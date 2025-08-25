import React, { useContext } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TiThMenu } from "react-icons/ti";
import ThemeContext from '@/utils/ThemeContext';
const Logout = () => {
    const {user} = useContext(ThemeContext)
    const isAdmin = user.status === 'admin' ? true : false
    const handleNavigation = (path) => {
        if (path === 'logout') {
            localStorage.clear();
            window.location.href = "/login";
        }
        window.location.href = path;
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='w-6 h-6'><TiThMenu className='w-full h-full' /></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup >
                    {
                        isAdmin ?
                            <DropdownMenuRadioItem value="right" className=' bg-red-500 text-white' onSelect={() => handleNavigation('logout')}>ออกจากระบบ</DropdownMenuRadioItem>
                            :
                            <>
                                <DropdownMenuRadioItem value="right" className=' mb-3 border-2 ' onSelect={() => handleNavigation('/olddata')}>ข้อมูลเก่า</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="right" className=' bg-red-500 text-white' onSelect={() => handleNavigation('logout')}>ออกจากระบบ</DropdownMenuRadioItem>
                            </>
                    }
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Logout