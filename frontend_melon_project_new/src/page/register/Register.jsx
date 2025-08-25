import { apiClient } from '@/lib/api-client';
import { LOGIN, REGISTER } from '@/utils/constant';
import ThemeContext from '@/utils/ThemeContext';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Import React Icon for default profile
import { FaEdit } from "react-icons/fa";

const Register = () => {
    const { user } = useContext(ThemeContext);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        profileImage: null,
        firstName: "",
        lastName: "",
        phone: "",
        fullName: "" // Add state for profile image
    });
    const [previewImage, setPreviewImage] = useState(null); // For previewing selected image
    const navigate = useNavigate();
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // ตั้งค่าความกว้างและความสูงที่เราต้องการย่อรูป
                    const MAX_WIDTH = 200; // ความกว้างสูงสุดที่เราต้องการ
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    // วาดภาพลงใน canvas
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // แปลง canvas เป็น Blob แทน Base64
                    canvas.toBlob((blob) => {
                        const resizedImageFile = new File([blob], file.name, { type: 'image/jpeg' });
                        setPreviewImage(URL.createObjectURL(resizedImageFile)); // แสดงภาพ preview

                        // บันทึกภาพ Blob ลงใน formData สำหรับการส่งไปยัง backend
                        setFormData({
                            ...formData,
                            profileImage: resizedImageFile, // เก็บภาพเป็น Blob แทน Base64
                        });
                    }, 'image/jpeg', 0.7); // คุณภาพ 0.7
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const submitLogin = async (event) => {
        event.preventDefault();
        // console.log(formData)

        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('fullName', `${formData.firstName + ' ' + formData.lastName}`);
        formData.profileImage && formDataToSend.append('profileImage', formData.profileImage); // Append the image only if selected
        // console.log(formDataToSend)
        try {
            await apiClient.post(REGISTER, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                if (response.status === 200) {
                    setFormData({
                        username: '',
                        password: '',
                        profileImage: null,
                        firstName: "",
                        lastName: "",
                        phone: "",
                        fullName: "" // Add state for profile image
                    });
                    setPreviewImage(null)
                    toast.success(response?.data?.message)
                    navigate('/login')
                }
            });
        } catch (e) {
            console.log(e);
            toast.error(e.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className='flex justify-center translate-y-[0%]'>
            <div className="max-w-[350px] bg-white bg-gradient-to-t from-white to-[#f1fff8] rounded-[40px] p-6 sm:p-8 border-5 border-white shadow-md shadow-[rgba(45,77,76,0.88)] m-5">
                <div className="text-center font-black text-[30px] text-green_seccond">ลงทะเบียน</div>
                <div className="flex justify-center mt-5">
                    {/* Profile Image Preview */}
                    <label htmlFor="profileImageInput" className="cursor-pointer relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-lg">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                            ) : (
                                <FaUserCircle className="text-gray-400 text-8xl" /> // Default Icon if no image
                            )}
                        </div>
                        <div className='absolute bottom-0 right-2 text-gray-500'><FaEdit /></div>
                    </label>
                    <input
                        id="profileImageInput"
                        className="w-full p-2 border rounded-lg"
                        type="file"
                        name="profileImage"
                        onChange={handleImageChange} // Handle image upload
                        accept="image/*"
                        hidden
                    />
                </div>
                <form className="mt-5" onSubmit={submitLogin}>

                    <input
                        required
                        className="w-full bg-white border-none p-4 rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#E3F1CA] border-transparent focus:outline-none placeholder:text-[#AAA]"
                        type="text"
                        name="username"
                        id="username"
                        placeholder="ชื่อผู้ใช้"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    <input
                        required
                        className="w-full bg-white border-none p-4 rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#E3F1CA] border-transparent focus:outline-none placeholder:text-[#AAA]"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="รหัสผ่าน"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <input
                        required
                        className="w-[50%] bg-white border-none p-4 rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#E3F1CA] border-transparent focus:outline-none placeholder:text-[#AAA]"
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="ชื่อ"
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                    <input
                        required
                        className="w-[50%] bg-white border-none p-4 rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#E3F1CA] border-transparent focus:outline-none placeholder:text-[#AAA]"
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="นามสกุล"
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
                    <input
                        required
                        className="w-full bg-white border-none p-4 rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#E3F1CA] border-transparent focus:outline-none placeholder:text-[#AAA]"
                        type="number"
                        name="phone"
                        id="phone"
                        placeholder="เบอร์โทร"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    <input
                        className="block w-full font-bold bg-gradient-to-br from-green_dark to-[#416b02] text-white py-4 mt-5 rounded-[20px] border-none transition ease-in-out duration-200 transform hover:scale-105 active:scale-95"
                        type="submit"
                        value="ลงทะเบียน"
                    />
                </form>
                <span className="block text-center mt-4">
                    <p className="text-[#136634] text-[12px] no-underline">ลงทะเบียนเข้าใช้ระบบประมวนผลสวนเมล่อน</p>
                    <p className="text-[#136634] text-[16px] underline mt-5" onClick={(e => navigate('/login'))}>ลงชื่อเข้าใช้</p>
                </span>
            </div>
        </div>
    );
};

export default Register;
