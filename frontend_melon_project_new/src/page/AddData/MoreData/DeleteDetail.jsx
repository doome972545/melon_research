import React, { useContext, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api-client'
import { DELETE_MELON_COSTS } from '@/utils/constant'
import ThemeContext from '@/utils/ThemeContext'
import Loading from '@/components/Loading'

const DeleteDetail = ({ item, data, selectActivities }) => {
    const [openLoader, setOpenLoader] = useState(false)
    const { setAddMelonCost } = useContext(ThemeContext)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const token = localStorage.getItem('token')
    async function handleButtonClick(event) {
        const buttonName = event.target.name; // รับค่า name ของปุ่มที่ถูกคลิก
        if (buttonName === "submit") {
            setOpenLoader(true)
            setOpenModalDelete(true)
            await apiClient.post(DELETE_MELON_COSTS, { item, selectActivities },
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                })
                .then((response) => {
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
        <div>
            <Loading openLoad={openLoader} />
            <Dialog onOpenChange={setOpenModalDelete} open={openModalDelete}>
                <DialogTrigger>
                    <MdDelete className='w-5 h-5 text-red-500' />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-left">คุณต้องการจะลบข้อมูลหรือไม่</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex gap-3 w-full'>
                        <Button variant="destructive" className="w-full" name="submit" onClick={handleButtonClick}>ตกลง</Button>
                        <Button variant="outline" className="w-full" name="cancel" onClick={handleButtonClick}>ยกเลิก</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DeleteDetail