import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { apiClient } from '@/lib/api-client';
import { GET_MELON_COSTS } from '@/utils/constant';
const DetailOldData = ({ data, selectActivities }) => {
    const [getmeloncost, setGetmeloncost] = useState({
        list: [],
        total_cost: 0,
    })
    const token = localStorage.getItem('token')
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
        return `${day} ${month} ${year}`;
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
        get_melon_cost()
    }, [])
    return (
        <div className='border rounded-md mt-4'>
            <Table>
                {/* <TableCaption></TableCaption> */}
                <TableHeader>
                    <TableRow>
                        <TableHead>ลำดับ</TableHead>
                        <TableHead className="w-[100px]">วันเวลา</TableHead>
                        <TableHead>รายการ</TableHead>
                        <TableHead>ราคา</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {getmeloncost.list.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="w-0 text-center">{index + 1}</TableCell>
                            <TableCell className="font-medium">{formatToThaiDate(item.create_at)}</TableCell>
                            <TableCell>{item.list_name}</TableCell>
                            {/* <TableCell>{formattedNumber(item.cost)} บาท</TableCell> */}
                            <TableCell>{item.cost !== null && item.cost !== undefined ? formattedNumber(item.cost) + "" : '0 '}</TableCell>
                            <TableCell className="">
                                <div className='flex justify-evenly'>
                                    {/* <DeleteDetail item={item} selectActivities={selectActivities} />
                                    <EditDetail item={item} getList={getList} data={data} selectActivities={selectActivities} /> */}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="w-full">
                        <TableCell colSpan={3}>ราคารวม</TableCell>
                        <TableCell className="text-left">{getmeloncost.total_cost !== null && getmeloncost.total_cost !== undefined ? formattedNumber(getmeloncost.total_cost) : '0'} </TableCell>
                        {/* <TableCell className="text-left">{getmeloncost ? formattedNumber(getmeloncost.total_cost) : ''} บาท</TableCell> */}
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export default DetailOldData