import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { Label } from '@radix-ui/react-label'
import React from 'react'

const modal = ({ childern }) => {
    return (
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
                {/* <button className='bg-indigo-600 text-white px-2 py-2 rounded-lg text-sm flex items-center gap-1'>
            <IoMdAddCircle />เพิ่ม
        </button> */}
            </DialogTrigger>
            <DialogContent className="z-[1001] -mt-16  max-w-[80vw] rounded-md overflow-y-auto max-h-[80vh]">
                <DialogHeader className='text-start'>
                    <DialogTitle>ตั้งค่า</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Label>ชื่อปุ่ย</Label>
                <Input placeholder="ระบุชื่อปุ่ย" type="text" name="fertilizer_name" value={formData.fertilizer_name} onChange={handleChange} />
                <Label>หน่วย (CC หรือ L)</Label>
                <Input placeholder="ระบุหน่วย" type="text" name="fertilizer_unit" value={formData.fertilizer_unit} onChange={handleChange} />
                <Label>ราคา ต่อ 1 หน่วย</Label>
                <Input placeholder="ระบุราคา" type="number" name="fertilizer_price" value={formData.fertilizer_price} onChange={handleChange} />
                <DialogFooter>
                    <button type="submit" onClick={() => handleSubmit(formData)} className="bg-green_seccond text-black px-2 py-1 rounded-md">บันทึก</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default modal