import { apiClient } from '@/lib/api-client'
import { APPROVE_USER, GET_USERS } from '@/utils/constant'
import React, { useEffect, useState } from 'react'
import { IoPersonSharp } from 'react-icons/io5'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from 'recharts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
const UserApprove = () => {
    const token = localStorage.getItem('token')
    const [listUser, setListUser] = useState([])
    const [selectUser, setSelectUser] = useState([])
    const [open, setOpen] = useState(false)
    async function fecthUser() {
        // setOpenLoader(true)
        await apiClient.get(GET_USERS, {
            headers: {
                Authorization: 'Bearer ' + token // Correct way to set the Authorization header
            }
        }).then((response) => {
            // console.log(response);
            setTimeout(() => {
                // setOpenLoader(false)
            }, 500);
            setListUser(response.data);
        })
    }
    useEffect(() => {
        fecthUser()
    }, [])
    function handleSelectUser(data) {
        setSelectUser(data)
        setOpen(true)
    }
    async function approveUser() {
        await apiClient.post(APPROVE_USER, selectUser, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                setOpen(false)
                fecthUser()
            }
        })
    }
    // console.log(listUser)
    function formatToThaiDate(dateString) {
        const months = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ];
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear() + 543; // Convert to Thai Buddhist Era (BE)
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${year}`;
    }
    return (
        <div className='mx-4 mb-32'>
            {
                listUser && listUser.length > 0 &&
                (
                    listUser.map((item, index) => (
                        item.status === 'user' &&
                        <div key={index} onClick={(() => handleSelectUser(item))} className=' relative rounded-md px-4 py-3 mt-3 flex justify-between shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
                            <div className='flex items-center'>
                                <>
                                    <div className='w-16 h-16 flex justify-center items-center relative '>
                                        {
                                            item.profile_info ?
                                                // <img src={item.profile_info} alt={item.fullname} />
                                                // <Avatar className="w-16 h-16" >
                                                //     <AvatarImage src={item.profile_info} alt="@shadcn" />
                                                //     <AvatarFallback>CN</AvatarFallback>
                                                // </Avatar>
                                                
                                                <img src={item.profile_info} alt="" className='w-full h-full rounded-full object-fill' />
                                                :
                                                <IoPersonSharp className='w-full h-full text-[#BCcE6F]' />
                                        }
                                    </div>
                                    <div className='ml-5'>
                                        <b className=' text-base'>ชื่อผู้ใช้: <p className='inline-block font-medium text-base'>{item.fullName}</p></b>
                                        <br />
                                        <b className=' text-base'>เบอร์โทร: <p className='inline-block font-medium text-base'>{item.phone}</p></b>
                                        <br />
                                    </div>
                                </>
                            </div>
                        </div>
                    ))
                )
            }
            <Dialog onOpenChange={setOpen} open={open} className="">
                <DialogTrigger></DialogTrigger>
                <DialogContent className="-translate-y-64">
                    <DialogHeader>
                        <DialogTitle className="text-left">ข้อมูลส่วนตัว</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-3'>
                        <div className='flex justify-center items-center'>
                            {
                                selectUser.profile_info ?
                                    // <img src={selectUser.profile_info} alt={selectUser.fullname} />
                                    <Avatar className="w-16 h-16" >
                                        <AvatarImage src={selectUser.profile_info} alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    // <img src={selectUser.profile_info} alt="" className='w-full h-full rounded-full object-fill' />
                                    :
                                    <IoPersonSharp className='w-16 h-16 text-[#BCcE6F]' />
                            }
                        </div>
                        
                        <b className=' text-base'>ชื่อผู้ใช้: <p className='inline-block font-medium text-base'>{selectUser.fullName}</p></b>
                        <b className=' text-base'>เบอร์โทร: <p className='inline-block font-medium text-base'>{selectUser.phone}</p></b>
                        <b className=' text-base'>ลงทะเบียนเมื่อ: <p className='inline-block font-medium text-base'>{formatToThaiDate(selectUser.create_At)}</p></b>
                        <p className='text-xs'><b className='text-red-400'>* </b>ยืนยันการเข้าใช้งาน</p>
                        <div className='w-full flex gap-3'>
                            <Button className='w-full bg-emerald-600' onClick={approveUser}>ยืนยัน</Button>
                            <Button className="w-full" variant="outline" onClick={(e => setOpen(false))}>ยกเลิก</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UserApprove