import Loading from '@/components/Loading'
import { apiClient } from '@/lib/api-client'
import { GET_USER_ALL_HOUSE } from '@/utils/constant'
import React, { useEffect, useState } from 'react'
import { RiHome2Fill } from 'react-icons/ri'
import DetailGreenHouse from './DetailGreenHouse'

const GreenHouseAtUser = ({ selectUser, onSelectData, sendBack }) => {
    const token = localStorage.getItem('token')
    const [openLoader, setOpenLoader] = useState(false);
    const [userHouse, setUserHouse] = useState([]);
    const [selectData, setSelectData] = useState(null);
    // console.log(selectUser)

    const fetchData = async () => {
        setOpenLoader(true)
        await apiClient.post(GET_USER_ALL_HOUSE, { user_id: selectUser.id }, {
            headers: {
                Authorization: 'Bearer ' + token // Correct way to set the Authorization header
            }
        }).then((response) => {
            setTimeout(() => {
                setOpenLoader(false)
            }, 500);
            // console.log(response.data.data)
            setUserHouse(response.data.data)
        })
    }
    useEffect(() => {
        if (sendBack) {
            setSelectData(null)
            onSelectData(null);
        }
    }, [sendBack])
    useEffect(() => {
        fetchData()
        if (sendBack) {
            setSelectData(null)
        }
    }, [])
    function formattedNumber(number) {
        if (number === null) {
            return ''; // or return '0' or any other default value you'd like
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    function formatToThaiDate(timestamp) {
        const months = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ];
        const daysOfWeek = [
            'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'
        ];
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear() + 543;
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
    }
    const handleSelectData = (item) => {
        setSelectData(item);
        onSelectData(item); // ส่งข้อมูลกลับไปยัง component ก่อนหน้านี้
    }
    const filteredHouses = userHouse.filter(item => item.status === 'start');
    return (
        <div>
            <Loading openLoad={openLoader} />
            <div className='flex flex-col gap-3'>
                {
                    selectData ? <DetailGreenHouse userData={selectUser} houseData={selectData} /> :
                        userHouse && userHouse.length > 0 ?
                            (
                                filteredHouses.map((item, index) => (
                                    item.status === 'start' ?
                                        <div key={index} className='relative rounded-md px-4 py-3 flex shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
                                            <div className='flex items-center' onClick={() => handleSelectData(item)}>
                                                <>
                                                    <div className='w-16 h-16 flex justify-center items-center relative '>
                                                        <p className='absolute text-white'>{index + 1}</p>
                                                        <RiHome2Fill className='w-full h-full text-[#BCcE6F]' />
                                                    </div>
                                                    <div className='ml-5'>
                                                        <b className=' text-base'>ชื่อโรงเรือน: <p className='inline-block font-medium text-base'>{item.house_name}</p></b>
                                                        <br />
                                                        <b className='text-base'>รายละเอียด:
                                                            {
                                                                item.house_desc ? <b> <p className='inline-block font-medium text-base'>{item.house_desc}</p></b> : ' -'
                                                            }
                                                        </b>
                                                        <br />
                                                        <b className=' text-base'>ประเภทการปลูก:  <p className='inline-block font-medium text-base'>{item.planting_name}</p></b>
                                                        <br />
                                                        <b className=' text-base'>ราคาต้นทุน:  <p className='inline-block font-medium text-base'>{formattedNumber(item.cost)} บาท</p></b>
                                                        <br />
                                                        <b className=' text-base'>เพิ่มเมื่อ:  <p className='inline-block font-medium text-base'>{formatToThaiDate(item.create_at)}</p></b>
                                                    </div>
                                                </>
                                            </div>
                                        </div>
                                        : ""
                                ))
                            )
                            : ''
                }
            </div>
        </div>
    )
}

export default GreenHouseAtUser