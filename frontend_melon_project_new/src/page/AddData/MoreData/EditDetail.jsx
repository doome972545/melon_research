import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@radix-ui/react-label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useContext, useState } from 'react'
import { LuClipboardEdit } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeContext from '@/utils/ThemeContext';
import { apiClient } from '@/lib/api-client';
import { EDIT_MELON_COSTS } from '@/utils/constant';
import Loading from '@/components/Loading';

const EditDetail = ({ item, getList, data, selectActivities }) => {
    const [openLoader, setOpenLoader] = useState(false)
    const { setAddMelonCost } = useContext(ThemeContext)
    const token = localStorage.getItem('token')
    const [openModal, setOpenModal] = useState(false)
    const [formData, setFormData] = useState({
        activities_id: 0,
        cost: item.cost,
        costed: item.cost,
        cost_type: item.cost_type,
        create_at: "",
        house_id: item.house_id,
        list_id: item.list_id,
        list_name: item.list_name,
        mc_id: item.mc_id,
        planting_type_id: item.planting_type_id,
        update_at: null,
        user_id: item.user_id,
        selectActivities: selectActivities,
        datahouse: data,
    })
    async function submit_edit() {
        setOpenLoader(true)
        await apiClient.post(EDIT_MELON_COSTS, formData, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {
            setOpenModal(false)
            setAddMelonCost(true)
            setTimeout(() => {
                setAddMelonCost(false);
                setOpenLoader(false)
            }, 600);
        })
    }
    return (
        <div>
            <Loading openLoad={openLoader} />
            <Dialog onOpenChange={setOpenModal} open={openModal}>
                <DialogTrigger><LuClipboardEdit className='w-5 h-5 text-amber-400' /></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-left'>แก้ไขข้อมูล</DialogTitle>
                        <DialogDescription className>
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-3 items-start '>
                        <Label className='text-sm'>รายการที่ทำการแก้ไข<b className=' text-red-600 '>* </b><b className='font-thin text-xs '>จำเป็นต้องระบุ</b></Label>
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
                                <SelectValue placeholder={item.list_name} />
                            </SelectTrigger>
                            <SelectContent className="z-[1002]">
                                <SelectGroup>
                                    {
                                        getList.length > 0 &&
                                        getList.map((item, index) => (
                                            <SelectItem key={index} value={item.cost_id}>
                                                {item.list_name}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Label>ต้นทุน</Label>
                        <Input
                            value={formData.cost !== null && formData.cost !== undefined ? formData.cost : item.cost} // ถ้ามีค่าใน formData.cost ให้ใช้ ถ้าไม่มีให้ใช้ item.cost
                            onChange={(e) => {
                                const value = e.target.value;
                                // ตรวจสอบว่าค่าว่างหรือไม่
                                setFormData({
                                    ...formData,
                                    costed: item.cost,
                                    cost: value === "" ? "" : parseFloat(value), // หากเป็นค่าว่าง ให้ตั้งค่าเป็นค่าว่าง, ถ้าไม่ใช่ให้แปลงเป็นตัวเลข
                                });
                            }}
                            placeholder="รายละเอียด"
                            type="text"  // ใช้ type="text" แทน type="number"
                            name="house_desc"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={submit_edit} type="submit" className="bg-lime-800">แก้ไข</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditDetail