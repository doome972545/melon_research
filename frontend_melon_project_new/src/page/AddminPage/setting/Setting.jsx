import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_COSTS,
  EDIT_COSTS,
  GET_ACTIVITIES,
  GET_COSTS,
} from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

const Setting = () => {
  const token = localStorage.getItem("token");
  const [getCost, setGetCost] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [activity, setActivity] = useState([]);
  const [formData, setFormData] = useState({
    activity_id: null,
    list_name: "",
    cost_clay: null,
    cost_sand: null,
    cost_bags: null,
    cost_pots: null,
  });
  const [openLoader, setOpenLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  async function get_Cost() {
    await apiClient
      .get(GET_COSTS, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((response) => {
        setGetCost(response.data);
      });
  }
  async function get_Activities() {
    await apiClient
      .get(GET_ACTIVITIES, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((response) => {
        setActivity(response.data);
      });
  }
  function selectTableData(data) {
    setSelectData(data);
    setOpenModal(true);
  }
  async function handleSubmit() {
    setOpenLoader(true);
    await apiClient
      .post(EDIT_COSTS, selectData, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((response) => {
        setOpenModal(false);
        get_Cost();
        // setGetCost(response.data)
        setOpenLoader(false);
      });
  }
  async function handleCreate() {
    if (formData.activity_id == null || formData.list_name == "") {
      return toast.error("กรุณาระบุกิจกรรม และ ชื่อรายการ");
    }
    setOpenLoader(true);
    await apiClient
      .post(CREATE_COSTS, formData, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        get_Cost();
        setOpenModalCreate(false);
        setOpenLoader(false);
      });
  }
  useEffect(() => {
    get_Cost();
    get_Activities();
  }, []);
  // จัดกลุ่มข้อมูลตาม activity_name
  const groupedData =
    Array.isArray(getCost) && getCost.length > 0
      ? getCost.reduce((acc, item) => {
          const activityName = item.activity_name;
          if (!acc[activityName]) {
            acc[activityName] = [];
          }
          acc[activityName].push(item);
          return acc;
        }, {})
      : {};
  return (
    <div className="mb-32 mt-3 mx-3">
      <Loading openLoad={openLoader} />
      <div className="flex justify-between items-center px-2 py-1 rounded-md shadow-[rgba(50,50,105,0.15)_0px_2px_5px_0px,rgba(0,0,0,0.05)_0px_1px_1px_0px]">
        <p>ตารางข้อมูล</p>
        <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
          <DialogTrigger asChild>
            <Button className="flex justify-center items-center bg-[#3F6212] px-3 py-1">
              เพิ่มข้อมูล
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left">เพิ่มข้อมูล</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <div className="">
                <Label className="">
                  <b className="text-red-600">*</b>
                  <b className="font-thin text-xs">เลือกกิจกรรม</b>
                </Label>
                <Select
                  className=""
                  value={formData.activity_id || ""} // ใช้ activity_id แทน activity_name
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      activity_id: value, // อัปเดตค่า activity_id ใน formData
                    });
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="เลือกกิจกรรม" />
                  </SelectTrigger>
                  <SelectContent className="z-[1002]">
                    <SelectGroup>
                      {activity &&
                        activity.length > 0 &&
                        activity.map((item, index) => (
                          <SelectItem key={index} value={item.activity_id}>
                            {item.activity_name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="">
                  <b className="text-red-600">*</b>
                  <b className="font-thin text-xs">ชื่อรายการ</b>
                </Label>
                <Input
                  className=""
                  placeholder="ชื่อรายการ"
                  value={formData.list_name ? formData.list_name : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      list_name: value, // อัปเดตค่า cost_pots
                    });
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="">
                    <b className="text-red-600">*</b>
                    <b className="font-thin text-xs">ดินเหนียว</b>
                  </Label>
                  <Input
                    className=""
                    placeholder="ดินเหนียว"
                    value={formData.cost_clay ? formData.cost_clay : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        cost_clay: value === "" ? "" : parseFloat(value), // อัปเดตค่า cost_clay
                      });
                    }}
                  />
                </div>

                <div>
                  <Label className="">
                    <b className="text-red-600">*</b>
                    <b className="font-thin text-xs">ดินทราย</b>
                  </Label>
                  <Input
                    className=""
                    placeholder="ดินทราย"
                    value={formData.cost_sand ? formData.cost_sand : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        cost_sand: value === "" ? "" : parseFloat(value), // อัปเดตค่า cost_sand
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className="">
                    <b className="text-red-600">*</b>
                    <b className="font-thin text-xs">กระถาง</b>
                  </Label>
                  <Input
                    className=""
                    placeholder="กระถาง"
                    value={formData.cost_pots ? formData.cost_pots : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        cost_pots: value === "" ? "" : parseFloat(value), // อัปเดตค่า cost_pots
                      });
                    }}
                  />
                </div>

                <div>
                  <Label className="">
                    <b className="text-red-600">*</b>
                    <b className="font-thin text-xs">ถุง</b>
                  </Label>
                  <Input
                    className=""
                    placeholder="ถุง"
                    value={formData.cost_bags ? formData.cost_bags : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        cost_bags: value === "" ? "" : parseFloat(value), // อัปเดตค่า cost_bags
                      });
                    }}
                  />
                </div>
              </div>
              <div className="mt-3">
                <Label className="">
                  <b className="text-red-600">*</b>
                  <b className="font-thin text-xs">สามารถโชว์ที่กราฟได้ไหม</b>
                </Label>
                <Select
                  className=""
                  value={formData.canShow || ""} // เชื่อมกับค่า `canShow`
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      canShow: value, // อัปเดตค่า canShow
                    });
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="เลือกสถานะการแสดง" />
                  </SelectTrigger>
                  <SelectContent className="z-[1002]">
                    <SelectGroup>
                      <SelectLabel>สถานะ</SelectLabel>
                      <SelectItem value="true">สามารถแสดง</SelectItem>
                      <SelectItem value="false">ไม่สามารถแสดง</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-green-600"
                onClick={handleCreate}
              >
                เพิ่ม
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-3 border rounded-md">
        <Table>
          <TableCaption>รายการกิจกรรมและรายละเอียด</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อกิจกรรม</TableHead>
              <TableHead>รายการ</TableHead>
              <TableHead>โชว์บนกราฟ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedData).map(([activityName, items]) =>
              items.map((item, index) => (
                <TableRow
                  key={item.cost_id}
                  onClick={() => selectTableData(item)}
                >
                  {index === 0 && (
                    <TableCell rowSpan={items.length} className="font-medium">
                      {activityName}
                    </TableCell>
                  )}
                  <TableCell>{item.list_name}</TableCell>
                  <TableCell>
                    {item.canShow === "true" ? (
                      <p className="py-1 bg-green-400 rounded-md text-center text-white">
                        แสดง
                      </p>
                    ) : (
                      <p className="py-1 bg-red-500 rounded-md text-center text-white">
                        ไม่แสดง
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog onOpenChange={setOpenModal} open={openModal}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-left">ข้อมูลกิจกรรม</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <p>
              <b>ประเภทการปลูก: </b> {selectData.activity_name}
            </p>
            <Label className="">
              <b className="text-red-600">*</b>
              <b className="font-thin text-xs">รายการ</b>
            </Label>
            <Input
              className=""
              placeholder="รายการ"
              value={selectData.list_name ? selectData.list_name : ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectData({
                  ...selectData,
                  list_name: value, // อัปเดตค่า cost_bags
                });
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="">
                  <b className="text-red-600">*</b>
                  <b className="font-thin text-xs">ดินเหนียว</b>
                </Label>
                <Input
                  className=""
                  placeholder="ดินเหนียว"
                  value={selectData.cost_clay ? selectData.cost_clay : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectData({
                      ...selectData,
                      cost_clay: value === "" ? "" : parseFloat(value), // อัปเดตค่า cost_clay
                    });
                  }}
                />
              </div>

              <div>
                <Label className="">
                  <b className="text-red-600">*</b>
                  <b className="font-thin text-xs">ดินทราย</b>
                </Label>
                <Input
                  className=""
                  placeholder="ดินทราย"
                  value={selectData.cost_sand ? selectData.cost_sand : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectData({
                      ...selectData,
                      cost_sand: value === "" ? "" : parseFloat(value), // อัปเดตค่า cost_sand
                    });
                  }}
                />
              </div>

              <div>
                <Label className="">
                  <b className="text-red-600">*</b>
                  <b className="font-thin text-xs">กระถาง</b>
                </Label>
                <Input
                  className=""
                  placeholder="กระถาง"
                  value={selectData.cost_pots ? selectData.cost_pots : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectData({
                      ...selectData,
                      cost_pots: value === "" ? "" : parseFloat(value), // อัปเดตค่า cost_pots
                    });
                  }}
                />
              </div>

              <div>
                <Label className="">
                  <b className="text-red-600">*</b>
                  <b className="font-thin text-xs">ถุง</b>
                </Label>
                <Input
                  className=""
                  placeholder="ถุง"
                  value={selectData.cost_bags ? selectData.cost_bags : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectData({
                      ...selectData,
                      cost_bags: value === "" ? "" : parseFloat(value), // อัปเดตค่า cost_bags
                    });
                  }}
                />
              </div>
            </div>
            <div className="mt-3">
              <Label className="">
                <b className="text-red-600">*</b>
                <b className="font-thin text-xs">สามารถโชว์ที่กราฟได้ไหม</b>
              </Label>
              <Select
                className=""
                value={selectData.canShow || ""} // เชื่อมกับค่า `canShow`
                onValueChange={(value) => {
                  setSelectData({
                    ...selectData,
                    canShow: value, // อัปเดตค่า canShow
                  });
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="เลือกสถานะการแสดง" />
                </SelectTrigger>
                <SelectContent className="z-[1002]">
                  <SelectGroup>
                    <SelectLabel>สถานะ</SelectLabel>
                    <SelectItem value="true">สามารถแสดง</SelectItem>
                    <SelectItem value="false">ไม่สามารถแสดง</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-green-600"
              onClick={handleSubmit}
            >
              เปลี่ยนแปลง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Setting;
