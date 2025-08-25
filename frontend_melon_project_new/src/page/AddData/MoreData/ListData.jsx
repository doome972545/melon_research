import React, { useContext, useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { apiClient } from '@/lib/api-client'
import { GET_ACTIVITIES, GET_ACTIVITIES_COSTS, SAVEACTIVITIES } from '@/utils/constant'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import toast from 'react-hot-toast'
import Loading from '@/components/Loading'
import DetailData from './DetailData'
import { FaCircleArrowLeft } from 'react-icons/fa6'
import ThemeContext from '@/utils/ThemeContext'

const ListData = ({ data, sendbackData = Object }) => {
    const { addMelonCost } = useContext(ThemeContext)
    const token = localStorage.getItem('token')
    const [openLoader, setOpenLoader] = useState(false);
    const [activities, setActivities] = useState([])
    const [activities_costs, setActivities_costs] = useState([])
    const [selected, setSelected] = useState(null)
    // console.log(user.status)
    async function fetchActivities() {
        setOpenLoader(true)
        await apiClient.get(GET_ACTIVITIES, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {
            setOpenLoader(false)
            setActivities(response.data)
        })

    }
    async function fetchActivities_costs() {
        setOpenLoader(true)
        await apiClient.get(GET_ACTIVITIES_COSTS + '/' + data.house_id, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {
            setOpenLoader(false)
            setActivities_costs(response.data)
        })
    }
    async function handleActivityChange(value) {
        setOpenLoader(true)
        try {
            await apiClient.post(SAVEACTIVITIES, { activity_id: value, house_id: data.house_id }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then((response) => {
                if (response.data.message === "ได้สร้างไปแล้ว") {
                    toast.error('ได้สร้างไปแล้ว')
                    setTimeout(() => {
                        sendbackData(null)
                        setSelected(null)
                    }, 500);
                } else {
                    toast.success('เพิ่มกิจกรรมเรียบร้อยแล้ว')
                    setTimeout(() => {
                        sendbackData(null)
                        setSelected(null)
                    }, 500);
                }
                setTimeout(() => {
                    fetchActivities_costs()
                    setOpenLoader(false)
                }, 1000);
            })
        } catch (error) {
            console.error('Failed to send selected activity', error);
        }
    }
    useEffect(() => {
        fetchActivities()
        fetchActivities_costs()
    }, [])
    useEffect(() => {
        fetchActivities()
        fetchActivities_costs()
    }, [addMelonCost])
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

    const selectData = (item) => {
        setSelected(item)
        sendbackData(item); // ส่งข้อมูลกลับไปยังคอมโพเนนต์แม่
    }
    function backpopup() {
        sendbackData(null)
        setSelected(null)
    }
    function formattedNumber(number) {
        if (number === null) {
            return ''; // or return '0' or any other default value you'd like
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return (
        <div>
            {
                selected ?
                    <header className='bg-green_dark text-white px-5 py-4 rounded-b-md'>
                        <div className='flex items-center gap-3'>
                            <FaCircleArrowLeft className='w-6 h-6 text-green_light' onClick={backpopup} />
                            {selected.activity_name}
                        </div>
                    </header>
                    : ""
            }
            <div className='mb-32 mt-5 mx-4'>
                <Loading openLoad={openLoader} />
                {
                    selected ?
                        <DetailData data={data} selectActivities={selected} /> :
                        <>
                            <div className='flex flex-col gap-2 px-2 py-1 rounded-md shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
                                <Label>เลือกกิจกรรม</Label>
                                <Select onValueChange={(value) => handleActivityChange(value)}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="เลือกกิจกรรม" />
                                    </SelectTrigger>
                                    <SelectContent className="z-[1002]">
                                        <SelectGroup>
                                            {
                                                activities.length > 0 &&
                                                activities.map((item, index) => (
                                                    <SelectItem key={index} value={item.activity_id}>
                                                        {item.activity_name}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            {
                                activities_costs && activities_costs.length > 0 ?
                                    (
                                        activities_costs.map((item, index) => (
                                            <div key={item.activities_costs_id} onClick={() => selectData(item)} className='mt-3 relative rounded-md px-4 py-3 flex shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
                                                <div className='flex items-center' >
                                                    <div className=''>
                                                        <b className=' text-base'>กิจกรรม: <p className='inline-block font-medium text-base underline'>{item.activity_name}</p></b>
                                                        <br />
                                                        <b className=' text-base'>ราคาต้นทุนรวม: <p className='inline-block font-medium text-base'>{formattedNumber(item.cost_all)} บาท</p></b>
                                                        <br />
                                                        <b className=' text-base'>เพิ่มเมื่อ: <p className='inline-block font-medium text-base'>{formatToThaiDate(item.created_at)}</p></b>
                                                        <br />
                                                          {
                                                            item.update_at ? <b className=' text-base'>อัพเดทเมื่อ:  <p className='inline-block font-medium text-base'>{formatToThaiDate(item.update_at)}</p></b>
                                                                : ""
                                                        }
                                                        {/* <b className=' text-base'>อัพเดทเมื่อ: <p className='inline-block font-medium text-base'>{formatToThaiDate(item.update_at)}</p></b> */}
                                                    </div>
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

export default ListData