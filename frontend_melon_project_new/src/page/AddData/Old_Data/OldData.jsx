import React, { useContext, useEffect, useState } from 'react'
import { FaCircleArrowLeft } from 'react-icons/fa6'
import { RiHome2Fill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import DetailOldData from './DetailOldData'
import { apiClient } from '@/lib/api-client'
import { DELETE_GREENHOUSE, GET_ACTIVITIES_COSTS, GET_HOUSE } from '@/utils/constant'
import Loading from '@/components/Loading'
import { MdDelete } from 'react-icons/md'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DELETE_MELON_COSTS } from '@/utils/constant'
import ThemeContext from '@/utils/ThemeContext'

const OldData = () => {
    const { setAddMelonCost, addMelonCost } = useContext(ThemeContext)
    const [selectData, setSelectData] = useState(null)
    const [selectActivitie, setSelectActivitie] = useState(null)
    const [openLoader, setOpenLoader] = useState(false);
    const [house, setHouse] = useState(null)
    const token = localStorage.getItem('token')
    const [modalData, setModalData] = useState(null);
    const navigate = useNavigate();
    const [activities_costs, setActivities_costs] = useState([])
    async function fetchActivities_costs() {
        if (!selectData || !selectData.house_id) {
            console.error("No house selected or house_id is missing");
            return;
        }
        setOpenLoader(true);
        await apiClient.get(GET_ACTIVITIES_COSTS + '/' + selectData.house_id, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {
            setTimeout(() => {
                setOpenLoader(false)
            }, 400);
            setActivities_costs(response.data)
        }).catch(error => {
            console.error("Error fetching data:", error);
            setOpenLoader(false);
        });
    }
    const fetchData = async () => {
        setOpenLoader(true)
        await apiClient.get(GET_HOUSE, {
            headers: {
                Authorization: 'Bearer ' + token // Correct way to set the Authorization header
            }
        }).then((response) => {
            setTimeout(() => {
                setOpenLoader(false)
            }, 400);
            setHouse(response.data.data)
        })
    }
    useEffect(() => {
        fetchData()
    }, [])
    useEffect(() => {
        fetchData()
    }, [addMelonCost])
    useEffect(() => {
        if (selectData) {  // ตรวจสอบว่า selectData มีค่าเป็น object ก่อนเรียก fetchActivities_costs
            fetchActivities_costs();
        }
    }, [selectData])
    useEffect(() => {
        // fetchActivities_costs();
        if (selectData) {  // ตรวจสอบว่า selectData มีค่าเป็น object ก่อนเรียก fetchActivities_costs
            fetchActivities_costs();
        }
    }, [addMelonCost])

    function formattedNumber(number) {
        if (number === null) {
            return ''; // or return '0' or any other default value you'd like
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
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
    const [openModalDelete, setOpenModalDelete] = useState(false)
    async function handleButtonClick(event, item) {
        setModalData(item)
        const buttonName = event.target.name; // รับค่า name ของปุ่มที่ถูกคลิก
        setOpenModalDelete(true)
        if (buttonName === "submit") {
            setOpenLoader(true)
            setOpenModalDelete(true)
            await apiClient.post(DELETE_GREENHOUSE, item,
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                })
                .then((response) => {
                    setModalData(null)
                    setAddMelonCost(true)
                    setTimeout(() => {
                        setOpenModalDelete(false)
                        setAddMelonCost(false);
                        setOpenLoader(false)
                    }, 600);
                })
        } else if (buttonName === "cancel") {
            setOpenModalDelete(false)
        }
    };
    return (
        <div className=''>
            <Loading openLoad={openLoader} />
            <header className='bg-green_dark text-white px-5 py-4 rounded-b-md flex justify-between'>
                {selectData ?
                    selectActivitie ? <div className='flex items-center gap-3'>
                        <FaCircleArrowLeft className='w-6 h-6 text-green_light' onClick={() => setSelectActivitie(null)} />
                        {selectActivitie.activity_name}
                    </div> :
                        <div className='flex items-center gap-3'>
                            <FaCircleArrowLeft className='w-6 h-6 text-green_light' onClick={() => setSelectData(null)} />
                            ข้อมูลของ {selectData.house_name}
                        </div>
                    : <div className='flex gap-3'>
                        <FaCircleArrowLeft className='w-6 h-6 text-green_light' onClick={() => navigate('/homeUser')} />
                        ข้อมูลเก่า
                    </div>
                }
            </header>
            <div className='mx-3 mt-3 mb-10 flex flex-col gap-3'>
                {
                    selectData ?
                        selectActivitie ?
                            <DetailOldData selectActivities={selectActivitie} data={selectData} />
                            :
                            activities_costs && activities_costs.length > 0 ?
                                (
                                    activities_costs.map((item, index) => (
                                        <div key={index} onClick={() => setSelectActivitie(item)} className=' relative rounded-md px-4 py-3 flex shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
                                            <div className='flex items-center' >
                                                <div className=''>
                                                    <b className=' text-base'>กิจกรรม: <p className='inline-block font-medium text-base underline'>{item.activity_name}</p></b>
                                                    <br />
                                                    <b className=' text-base'>ราคาต้นทุนรวม: <p className='inline-block font-medium text-base'>{formattedNumber(item.cost_all)} บาท</p></b>
                                                    <br />
                                                    <b className=' text-base'>เพิ่มเมื่อ: <p className='inline-block font-medium text-base'>{formatToThaiDate(item.created_at)}</p></b>
                                                    <br />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                                : ''
                        :
                        house && house.length > 0 ?
                            (
                                house.map((item, index) => (
                                    item.status === "end" ?
                                        <div key={index} className='relative rounded-md px-4 py-3  shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
                                            <div className='flex items-center' onClick={() => setSelectData(item)}>
                                                <div className='w-16 h-16 flex justify-center items-center relative '>
                                                    <p className='absolute text-white'>{index + 1}</p>
                                                    <RiHome2Fill className='w-full h-full text-[#BCcE6F]' />
                                                </div>
                                                <div className='ml-5 flex flex-col'>
                                                    <b className=' text-base'>ชื่อโรงเรือน: <p className='inline-block font-medium text-base'>{item.house_name}</p></b>
                                                    <b className='text-base'>รายละเอียด:
                                                        {
                                                            item.house_desc ? <b> <p className='inline-block font-medium text-base'>{item.house_desc}</p></b> : ' -'
                                                        }
                                                    </b>
                                                    <b className=' text-base'>ประเภทการปลูก:  <p className='inline-block font-medium text-base'>{item.planting_name}</p></b>
                                                    <b className=' text-base'>ราคาต้นทุน:  <p className='inline-block font-medium text-base'>{formattedNumber(item.cost)} บาท</p></b>
                                                    <b className=' text-base'>สร้างเมื่อ:  <p className='inline-block font-medium text-base'>{formatToThaiDate(item.create_at)}</p></b>
                                                    {
                                                        item.update_at ? <b className=' text-base'>อัพเดทเมื่อ:  <p className='inline-block font-medium text-base'>{formatToThaiDate(item.update_at)}</p></b>
                                                            : ""
                                                    }
                                                </div>
                                            </div>
                                            <div className='w-full'>
                                                <Button className="h-7 w-[100%] bg-red-600" name='delete' onClick={((event) => handleButtonClick(event, item))}>ลบข้อมูล</Button>
                                            </div>
                                        </div>
                                        : ""
                                ))
                            )
                            : ""
                }
            </div>
            <div className='mt-3'>
                <Loading openLoad={openLoader} />
                <Dialog open={openModalDelete} onOpenChange={setOpenModalDelete} >
                    <DialogTrigger asChild>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-left">คุณต้องการจะลบข้อมูลหรือไม่</DialogTitle>
                            <DialogDescription>
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex gap-3 w-full'>
                            <Button variant="destructive" className="w-full" name="submit" onClick={(event) => handleButtonClick(event, modalData)}>ตกลง</Button>
                            <Button variant="outline" className="w-full" name="cancel" onClick={handleButtonClick}>ยกเลิก</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default OldData