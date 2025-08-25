import Loading from '@/components/Loading';
import { apiClient } from '@/lib/api-client';
import { GET_USERS } from '@/utils/constant';
import React, { useEffect, useState } from 'react'
import { RiHome2Fill } from 'react-icons/ri';
import { IoPersonSharp } from "react-icons/io5";
import { FaCircleArrowLeft } from 'react-icons/fa6';
import GreenHouseAtUser from './greenHouseAtUser';
import Logout from '@/page/logout/logout';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

const UserList = () => {
    const token = localStorage.getItem('token')
    const [sendBack, setSendBack] = useState(false);
    const [listUser, setListUser] = useState(null);
    const [selectData, setSelectData] = useState(null);
    const [selectGreen, setSelectedHouse] = useState(null);
    const [openLoader, setOpenLoader] = useState(false);
    async function fecthUser() {
        setOpenLoader(true)
        await apiClient.get(GET_USERS, {
            headers: {
                Authorization: 'Bearer ' + token // Correct way to set the Authorization header
            }
        }).then((response) => {
            // console.log(response);
            setTimeout(() => {
                setOpenLoader(false)
            }, 500);
            setListUser(response.data);
        })
    }
    useEffect(() => {
        fecthUser()
    }, [])
    function formattedNumber(number) {
        if (number === null) {
            return ''; // or return '0' or any other default value you'd like
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    const handleSelectData = (data) => {
        setSelectedHouse(data);
    };
    const popBack = (data) => {
        setSendBack(data);
        setTimeout(() => {
            setSendBack(false)
        }, 500);
    };
    // นับจำนวน house ที่มี status เท่ากับ 'start'
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
        return `${day} ${month} ${year} ${hours}:${minutes} น.`;
    }
    return (
        <div className='mb-32'>
            <Loading openLoad={openLoader} />
            <header className='bg-green_dark text-white px-5 py-4 rounded-b-md'>
                {selectData ?
                    <div className='flex items-center gap-3 justify-between'>
                        {
                            selectGreen ?
                                <div className='flex gap-3'>
                                    <FaCircleArrowLeft className='w-6 h-6 text-green_light' onClick={() => popBack(true)} />
                                    โรงเรือนของ {selectGreen.house_name}
                                </div>
                                :
                                <div className='flex gap-3'>
                                    <FaCircleArrowLeft className='w-6 h-6 text-green_light' onClick={() => setSelectData(null)} />
                                    โรงเรือนของ {selectData.fullName}
                                </div>
                        }
                        <Logout />
                    </div>
                    :
                    <div className='flex justify-between'>
                        <p>รายชื่อผู้ใช้งาน</p>
                        <Logout />
                    </div>
                }
            </header>
            <div className='mx-4 mt-2 flex flex-col gap-3'>
                {
                    selectData ? <GreenHouseAtUser selectUser={selectData} onSelectData={handleSelectData} sendBack={sendBack} /> :
                        <>
                            {
                                listUser && listUser.length > 0 ?
                                    (
                                        listUser.map((item, index) => (

                                            item.status === 'farmer' &&
                                            <div key={index} className='relative rounded-md px-4 py-3 flex shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
                                                <div className='flex items-center' onClick={() => setSelectData(item)}>
                                                    <>
                                                        <div className='w-16 h-16 flex justify-center items-center relative '>
                                                            {
                                                                item.profile_info ?
                                                                    // <img src={item.profile_info} alt={item.fullname} />
                                                                    <Avatar className="w-16 h-16" >
                                                                        <AvatarImage src={item.profile_info} alt="@shadcn" />
                                                                        <AvatarFallback>CN</AvatarFallback>
                                                                    </Avatar>
                                                                    :
                                                                    <IoPersonSharp className='w-full h-full text-[#BCcE6F]' />
                                                            }
                                                        </div>
                                                        <div className='ml-5'>
                                                            <b className=' text-base'>ชื่อ: <p className='inline-block font-medium text-base'>{item.fullName}</p></b>
                                                            <br />
                                                            <b className=' text-base'>เบอร์โทร: <p className='inline-block font-medium text-base'>{item.phone}</p></b>
                                                            <br />
                                                            <b className=' text-base'>โรงเรือนทั้งหมด:  <p className='inline-block font-medium text-base'>{item.melon_count} หลัง</p></b>
                                                            <br />
                                                            <b className=' text-base'>ดำเนินการอยู่:  <p className='inline-block font-medium text-base'>{item.active_melon_count} หลัง</p></b>
                                                            <br />
                                                            <b className=' text-base'>สิ้นสุดการปลูก:  <p className='inline-block font-medium text-base'>{item.inactive_melon_count} หลัง</p></b>
                                                            <br />
                                                            <b className=' text-base'>ต้นทุนที่ดำเดินการขณะนี้:  <p className='inline-block font-medium text-base'>{item.total_cost_start !== null ? formattedNumber(item.total_cost_start) : 0} บาท</p></b>
                                                            <br />
                                                            <b className=' text-base'>ราคาต้นทุนรวม:  <p className='inline-block font-medium text-base'>{item.total_cost !== null ? formattedNumber(item.total_cost) : 0} บาท</p></b>
                                                            <br />
                                                            {
                                                                item.update_data &&
                                                                <>
                                                                    <b className=' text-base'>อัพเดทล่าสุด:  <p className='inline-block font-medium text-base'>{formatToThaiDate(item.update_data)} </p></b>
                                                                    <br />
                                                                </>
                                                            }
                                                        </div>
                                                    </>
                                                </div>
                                            </div>
                                        ))
                                    )
                                    : ''
                            }
                        </>
                }
            </div>
        </div>
    )
}

export default UserList