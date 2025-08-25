import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiClient } from '@/lib/api-client'
import { ADD_MELON_COSTS, GET_LIST, GET_MELON_COSTS } from '@/utils/constant'
import React, { useContext, useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Loading from '@/components/Loading'
import ThemeContext from '@/utils/ThemeContext'
import { MdDelete } from "react-icons/md";
import EditDetail from './EditDetail'
import DeleteDetail from './DeleteDetail'
const DetailData = ({ data, selectActivities }) => {
    const { setAddMelonCost, addMelonCost } = useContext(ThemeContext)
    const token = localStorage.getItem('token')
    const [openModal, setOpenModal] = useState(false)
    const [openLoader, setOpenLoader] = useState(false)
    const [getList, setGetList] = useState([])
    const [getmeloncost, setGetmeloncost] = useState({
        list: [],
        total_cost: 0,
    })
    const [formData, setFormData] = useState({
        cost: 0,
        cost_id: 0,
        list_id: 0,
        list_name: "",
    })

    async function fetchList() {
        await apiClient.post(GET_LIST, {
            activities_id: selectActivities.activities_id,
            planting_type_id: data.planting_type_id
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        },
        ).then((response) => {
            setGetList(response.data)
        })

    }
    async function submitData() {
        setOpenLoader(true)
        await apiClient.post(ADD_MELON_COSTS, formData, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {
            setAddMelonCost(true)
            setOpenModal(false)
            setTimeout(() => {
                setOpenLoader(false)
            }, 500);
            setFormData({
                cost: 0,
                cost_id: 0,
                list_id: 0,
                list_name: "",
            })
            fetchList()
            get_melon_cost()
            setTimeout(() => {
                setAddMelonCost(false);
            }, 600);
        })
    }
    async function get_melon_cost() {
        await apiClient.post(GET_MELON_COSTS, { data: data, selectActivities: selectActivities }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {
            setGetmeloncost(response.data)
        })
    }
    useEffect(() => {
        fetchList()
        get_melon_cost()
    }, [])

    useEffect(() => {
        fetchList()
        get_melon_cost()
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
        return `${day} ${month} ${year}`;
    }
    function formattedNumber(number) {
        return number !== null && number !== undefined
            ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : '0';
    }
    return (
        <div>
            <Loading openLoad={openLoader} />
            <div className='flex justify-between items-center px-2 py-1 rounded-md shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
                <div>
                    <h1>ประเภทการปลูก: {data.planting_name}</h1>
                    <h1>กิจกรรม: {selectActivities.activity_name}</h1>
                </div>
                <Dialog onOpenChange={setOpenModal} open={openModal}>
                    <DialogTrigger asChild>
                        <Button className='flex justify-center items-center bg-[#3F6212] px-3 py-1'>เพิ่มรายการ</Button>
                    </DialogTrigger>
                    <DialogContent className="">
                        <DialogHeader>
                            <DialogTitle className='text-start'>เพิ่มรายการ</DialogTitle>
                            <DialogDescription className="text-start">
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex flex-col gap-3'>
                            <Label>เลือกรายการ <b className=' text-red-600 '>* </b><b className='font-thin text-xs '>จำเป็นต้องระบุ</b></Label>
                            <Select onValueChange={(value) => {
                                const selectedItem = getList.find(item => item.list_id === value);
                                if (selectedItem.cost_sand) {
                                    setFormData({
                                        ...formData,
                                        cost: selectedItem.cost_sand || selectedItem.cost_clay || selectedItem.cost_pots || selectedItem.cost_bags,
                                        cost_sand: selectedItem.cost_sand,
                                        list_id: selectedItem.list_id,
                                        cost_type: "cost_sand",
                                        list_name: selectedItem.list_name,
                                        cost_id: selectedItem.cost_id,
                                        selectActivities: selectActivities,
                                        datahouse: data,
                                    })
                                } else if (selectedItem.cost_clay) {
                                    setFormData({
                                        ...formData,
                                        cost: selectedItem.cost_sand || selectedItem.cost_clay || selectedItem.cost_pots || selectedItem.cost_bags,
                                        cost_clay: selectedItem.cost_clay,
                                        list_id: selectedItem.list_id,
                                        cost_type: "cost_clay",
                                        list_name: selectedItem.list_name,
                                        cost_id: selectedItem.cost_id,
                                        selectActivities: selectActivities,
                                        datahouse: data,
                                    })
                                } else if (selectedItem.cost_pots) {
                                    setFormData({
                                        ...formData,
                                        cost: selectedItem.cost_sand || selectedItem.cost_clay || selectedItem.cost_pots || selectedItem.cost_bags,
                                        cost_pots: selectedItem.cost_pots,
                                        list_id: selectedItem.list_id,
                                        cost_type: "cost_pots",
                                        list_name: selectedItem.list_name,
                                        cost_id: selectedItem.cost_id,
                                        selectActivities: selectActivities,
                                        datahouse: data,
                                    })
                                } else if (selectedItem.cost_bags) {
                                    setFormData({
                                        ...formData,
                                        cost: selectedItem.cost_sand || selectedItem.cost_clay || selectedItem.cost_pots || selectedItem.cost_bags,
                                        cost_bags: selectedItem.cost_bags,
                                        list_id: selectedItem.list_id,
                                        cost_type: "cost_bags",
                                        list_name: selectedItem.list_name,
                                        cost_id: selectedItem.cost_id,
                                        selectActivities: selectActivities,
                                        datahouse: data,
                                    })
                                }
                            }}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder={formData.list_name ? formData.list_name : "เลือกรายการ"} value={formData.list_name} />
                                </SelectTrigger>
                                <SelectContent className="z-[1002] overflow-y-auto max-h-[80vh] mb-52">
                                    <SelectGroup>
                                        {
                                            getList.length > 0 &&
                                            getList.map((item, index) => (
                                                <SelectItem key={index} value={item.list_id}>
                                                    {item.list_name}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Label>ต้นทุน</Label>
                            <Input value={formData.cost}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        cost: e.target.value,  // Update cost based on user input
                                    })
                                } placeholder="รายละเอียด" type="number" name="house_desc" />
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={submitData} className="bg-lime-800">เพิ่มรายการ</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className='border rounded-md mt-4'>
                <Table>
                    {/* <TableCaption></TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">วันเวลา</TableHead>
                            <TableHead>รายการ</TableHead>
                            <TableHead>ราคา</TableHead>
                            <TableHead className="text-right">ตัวเลือก</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {getmeloncost.list.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{formatToThaiDate(item.create_at)}</TableCell>
                                <TableCell>{item.list_name}</TableCell>
                                {/* <TableCell>{formattedNumber(item.cost)} บาท</TableCell> */}
                                <TableCell>{item.cost !== null && item.cost !== undefined ? formattedNumber(item.cost) + "" : '0 '}</TableCell>
                                <TableCell className="">
                                    <div className='flex justify-evenly'>
                                        <DeleteDetail item={item} selectActivities={selectActivities} />
                                        <EditDetail item={item} getList={getList} data={data} selectActivities={selectActivities} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={2}>ราคารวม</TableCell>
                            <TableCell className="text-left">{getmeloncost.total_cost !== null && getmeloncost.total_cost !== undefined ? formattedNumber(getmeloncost.total_cost) : '0'} </TableCell>
                            {/* <TableCell className="text-left">{getmeloncost ? formattedNumber(getmeloncost.total_cost) : ''} บาท</TableCell> */}
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    )
}

export default DetailData