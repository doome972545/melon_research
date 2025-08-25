import React, { useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { apiClient } from '@/lib/api-client';
import { END_PROCRESS } from '@/utils/constant';
import Loading from '@/components/Loading';
import ThemeContext from '@/utils/ThemeContext';

const OpenModalSubmit = ({ data, nullData }) => {
    const { setAddMelonCost } = useContext(ThemeContext)
    const [openAlert, setOpenAlert] = useState(false);
    const [openLoader, setOpenLoader] = useState(false);
    // const [nullData, setNullData] = useState(false);
    const token = localStorage.getItem('token')

    async function handleButtonClick(event) {
        const buttonName = event.target.name; // รับค่า name ของปุ่มที่ถูกคลิก
        if (buttonName === "submit") {
            setOpenLoader(true)
            await apiClient.post(END_PROCRESS, data,
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            ).then(response => {
                // setNullData(true)
                setAddMelonCost(true)
                nullData()
                setTimeout(() => {
                    setOpenLoader(false)
                    setAddMelonCost(false)
                    setOpenAlert(false)  // ปิด Modal เมื่อสำเร็จ
                }, 600);
            })
        } else if (buttonName === "cancel") {
            setOpenAlert(false);  // ปิด Modal เมื่อกดยกเลิก
        }
    }

    useEffect(() => {
        setOpenAlert(true)
    }, [data])

    return (
        <div className='mt-3'>
            <Loading openLoad={openLoader} />
            <Dialog onOpenChange={setOpenAlert} open={openAlert}>
                <DialogTrigger asChild>
                    {/* <div className='w-full'>
                        <Button className="h-7 w-[100%] bg-green-600">สิ้นสุดการปลูก</Button>
                    </div> */}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-left">ต้องการที่จะสิ้นสุดการปลูกไหม</DialogTitle>
                        <DialogDescription></DialogDescription>
                        <div className='flex gap-3 w-full'>
                            <Button className="w-full bg-green-600" name="submit" onClick={handleButtonClick}>ตกลง</Button>
                            <Button variant="outline" className="w-full " name="cancel" onClick={handleButtonClick}>ยกเลิก</Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default OpenModalSubmit
