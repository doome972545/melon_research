import { apiClient } from '@/lib/api-client';
import { GET_LIST_COST_ADMIN, GET_USER_ACTIVITIES } from '@/utils/constant';
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
const DetailGreenHouse = ({ userData, houseData }) => {
    const [activitiesAdmin, setActivitiesAdmin] = useState([])
    const [listCostAdmin, setListCostAdmin] = useState({
        list: [],
        total_cost: 0,
    })
    const [selectData, setSelectData] = useState(null)
    const token = localStorage.getItem('token')
    // console.log('houseData :>> ', houseData);
    // console.log("DetailGreenHouse", userData)
    async function fetchActivities() {
        await apiClient.post(GET_USER_ACTIVITIES, { house_id: houseData.house_id, user_id: userData.id }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then((response) => {
                setActivitiesAdmin(response.data)
            })
    }
    async function fetchListCostActivities() {
        await apiClient.post(GET_LIST_COST_ADMIN, { selectActivities: selectData, user_id: userData.id }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then((response) => {
                setListCostAdmin(response.data)
            })
    }
    useEffect(() => {
        fetchActivities()
    }, [])
    useEffect(() => {
        if (selectData) {
            fetchListCostActivities()
        }
    }, [selectData])
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
    // console.log(selectData)
    return (
        <div>
            {
                selectData ?
                    <>
                        <div className='border rounded-md'>
                            <Table>
                                {/* <TableCaption></TableCaption> */}
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">วันเวลา</TableHead>
                                        <TableHead>รายการ</TableHead>
                                        <TableHead>ราคา</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {listCostAdmin.list.length > 0 ? (
                                        listCostAdmin.list.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{formatToThaiDate(item.create_at)}</TableCell>
                                                <TableCell>{item.list_name}</TableCell>
                                                <TableCell>{formattedNumber(item.cost)} บาท</TableCell>
                                                <TableCell className="text-right"></TableCell>
                                            </TableRow>
                                        ))
                                    ) : null}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={2}>ราคารวม</TableCell>
                                        <TableCell className="text-left">{formattedNumber(listCostAdmin.total_cost)} บาท</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </>
                    : activitiesAdmin && activitiesAdmin.length > 0 ?
                        (
                            activitiesAdmin.map((item, index) => (
                                <div key={item.activities_costs_id} onClick={() => setSelectData(item)} className='mb-3 relative rounded-md px-4 py-3 flex shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]'>
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
            }
        </div>
    )
}

export default DetailGreenHouse