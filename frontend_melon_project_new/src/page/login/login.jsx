import { apiClient } from "@/lib/api-client";
import { HOST, LOGIN } from "@/utils/constant";
import ThemeContext from "@/utils/ThemeContext";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  console.log(HOST);
  const { user } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const submitLogin = async (event) => {
    event.preventDefault();
    try {
      await apiClient.post(LOGIN, formData).then((response) => {
        localStorage.setItem("token", response.data.token);
        toast.success("เข้าสู่ระบบ!!");
        navigate("/home");
      });
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="flex justify-center translate-y-[20%]">
      <div className=" max-w-[350px] bg-white bg-gradient-to-t from-white to-[#f1fff8] rounded-[40px] p-6 sm:p-8 border-5 border-white shadow-md shadow-[rgba(45,77,76,0.88)] m-5">
        <div className="text-center font-black text-[30px] text-green_seccond">
          เข้าสู่ระบบ
        </div>
        <form className="mt-5">
          <input
            required
            className="w-full bg-white border-none p-4 rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#E3F1CA] border-transparent focus:outline-none  placeholder:text-[#AAA]"
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
            placeholder="ระหัสผ่าน"
            value={formData.password}
            onChange={handleInputChange}
          />
          <input
            className="block w-full font-bold bg-gradient-to-br from-green_dark to-[#416b02] text-white py-4 mt-5 rounded-[20px]  border-none transition ease-in-out duration-200 transform hover:scale-105  active:scale-95 "
            type="submit"
            value="เข้าสู่ระบบ"
            onClick={submitLogin}
          />
        </form>
        <span className="block text-center mt-4">
          <p className="text-[#136634] text-[12px] no-underline">
            ลงชื่อเข้าใช้ระบบประมวนผลสวนเมล่อน
          </p>
          <p
            className="text-[#136634] text-[16px] underline mt-5"
            onClick={(e) => navigate("/register")}
          >
            ลงทะเบียน
          </p>
        </span>
      </div>
    </div>
  );
};

export default Login;
