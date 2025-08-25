import React, { useContext, useEffect, useState } from 'react'
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { SelectGroup } from '@radix-ui/react-select'
import { ADD_HOUSE, GET_HOUSE, GET_PLANTING_TYPE } from '@/utils/constant'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'
import Loading from '@/components/Loading'
import { RiHome2Fill } from "react-icons/ri";
import ListData from './MoreData/ListData';
import ThemeContext from '@/utils/ThemeContext';
import { useNavigate } from 'react-router-dom';
import OpenModalSubmit from './OpenModalSubmit';
import Logout from '../logout/logout';

const AddHouse = () => {
    const navigate = useNavigate();
    const { addMelonCost } = useContext(ThemeContext)
    const token = localStorage.getItem('token')
    const { user } = useContext(ThemeContext)
    const [openLoader, setOpenLoader] = useState(false);
    const [openAddhouse, setOpenAddhouse] = useState(false);
    const [house, setHouse] = useState([]);
    const [planting, setPlanting] = useState([]);
    const [selectData, setSelectData] = useState(null);
    const [sendBack, setSendBack] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [formData, setFormData] = useState({
        user_id: user.user_id,
        house_name: "",
        house_desc: "",
        planting_type_id: 0,
        status_data: false,
    })
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const submitHouse = async () => {
        if (!formData.house_name) {
            toast.error("กรุณากรอกชื่อโรงเรือน")
        } else {
            try {
                setOpenLoader(true);
                await apiClient.post(ADD_HOUSE, formData, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }).then((response) => {
                    setFormData({
                        house_name: "",
                        house_desc: "",
                        planting_type_id: 0,
                        status_data: false,
                    })
                    toast.success("เพิ่มโรงเรือนสำเร็จ")
                    fetchData();
                    setTimeout(() => {
                        setOpenAddhouse(false)
                        setOpenLoader(false)
                    }, 1000);
                })
            } catch (e) {
                console.log(e)
            }
        }
    }
    const getplanting_type = async () => {
        setOpenLoader(true);
        await apiClient.get(GET_PLANTING_TYPE, {
            headers: {
                Authorization: 'Bearer ' + token // Correct way to set the Authorization header
            }
        }).then((response) => {
            setOpenLoader(false)
            setPlanting(response.data)
        })
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
            }, 1000);
            setHouse(response.data.data)
        })
    }
    useEffect(() => {
        fetchData();
        getplanting_type();
    }, [addMelonCost])
    useEffect(() => {
        fetchData();
        getplanting_type();
    }, [])
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
    const result = house
        .filter(item => item.status === "start") // Filter items where status is "start"
        .reduce(
            (acc, item) => {
                acc.totalCost += item.cost;
                acc.count += 1;
                return acc;
            },
            { totalCost: 0, count: 0 }
        );
    function summitModal(data) {
        // console.log(data)
        setModalData(data);  // เก็บข้อมูลที่ต้องการส่งไปให้ Modal
        setModalOpen(true);  // เปิด Modal
        // <OpenModalSubmit data={data} open={true} />
    }
    const filteredHouses = house.filter(item => item.status === 'start');
    const count = filteredHouses.length;
    return (
        <div className='mb-0'>
            <Loading openLoad={openLoader} />
            {
                sendBack ? "" :
                    <header className='bg-green_dark text-white px-5 py-4 rounded-b-md flex justify-between'>
                        {selectData ?
                            <div className='flex items-center gap-3'>
                                <FaCircleArrowLeft className='w-6 h-6 text-green_light' onClick={() => setSelectData(null)} />
                                ข้อมูลของ {selectData.house_name}
                            </div>
                            : <>
                                {
                                    user.status === 'admin' ? "รายชื่อผู้ใช้งาน" : "บันทึกข้อมูลโรงเรือน"
                                }
                            </>
                        }
                        <Logout />
                    </header>
            }
            {
                selectData ? <ListData data={selectData} sendbackData={setSendBack} />
                    :
                    <div className='mx-4 mt-2'>
                        <div className='flex justify-between items-center px-2 py-1 rounded-md shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
                            <h1>โรงเรือนทั้งหมด</h1>
                            <Dialog open={openAddhouse} onOpenChange={setOpenAddhouse}>
                                <DialogTrigger asChild>
                                    <Button className='flex justify-center items-center bg-[#3F6212] px-3 py-1'>เพิ่ม</Button>
                                </DialogTrigger>
                                <DialogContent className="">
                                    <DialogHeader>
                                        <DialogTitle className='text-start'>เพิ่มโรงเรือน</DialogTitle>
                                        <DialogDescription className="text-start">
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className='flex flex-col gap-3'>
                                        <Label>ชื่อโรงเรือน</Label>
                                        <Input placeholder="ชื่อโรงเรือน" type="text" name="house_name" value={formData.house_name} onChange={handleChange} />
                                        <Label>เลือกประเภทการปลูก <b className=' text-red-600 '>* </b><b className='font-thin text-xs '>จำเป็นต้องระบุ</b></Label>
                                        <Select onValueChange={(value) => setFormData({ ...formData, planting_type_id: value })}>
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="เลือกประเภทการปลูก" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[1002]">
                                                <SelectGroup>
                                                    {
                                                        planting.length > 0 &&
                                                        planting.map((item, index) => (
                                                            <SelectItem key={index} value={item.planting_id}>
                                                                {item.planting_name}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Label>รายละเอียดโรงเรือน <b className=' text-red-600 '>* </b><b className='font-thin text-xs '>ใส่หรือไม่ใส่ก็ได้</b></Label>
                                        <Input placeholder="รายละเอียด" type="text" name="house_desc" value={formData.house_desc} onChange={handleChange} />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={submitHouse} className="bg-lime-800">เพิ่มโรงเรือน</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr className='mt-2 mb-2' />
                        <div className='flex flex-col gap-3'>
                            {
                                house && house.length > 0 ?
                                    (
                                        filteredHouses.map((item, index) => (
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
                                                    <Button className="h-7 w-[100%] bg-green-600" onClick={(e => summitModal(item))}>สิ้นสุดการปลูก</Button>
                                                </div>
                                            </div>
                                        ))
                                    )
                                    : ''
                            }
                            {modalOpen && <OpenModalSubmit data={modalData} nullData={(() => { setModalData(null), setModalOpen(false) })} />}
                        </div>
                        <div className='mt-2 sticky bottom-0 bg-gray-200 rounded-md px-4 py-3  shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
                            <b>จำนวนโรงเรือนทั้งหมด: <p className='inline-block font-light'> {count} หลัง</p> </b>
                            <br />
                            <b>ยอดต้นทุนรวมทั้งหมด: <p className='inline-block font-light'> {formattedNumber(result.totalCost)} บาท</p></b>
                            {/* <h5 >จำนวนโรงเรือนทั้งหมด:</h5> */}
                        </div>
                    </div>
            }
        </div>
    )
}

export default AddHouse