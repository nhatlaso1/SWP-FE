import axios from "axios";
import { Province, District, Ward } from "../types/address";

// Cấu hình axios instance
const axiosInstance = axios.create({
  baseURL: "https://provinces.open-api.vn/api",
  headers: {
    Accept: "application/json",
  },
});

// Lấy danh sách tỉnh/thành phố
export const getProvinces = async (): Promise<Province[]> => {
  const response = await axiosInstance.get("/p/");
  return response.data;
};

// Lấy danh sách quận/huyện theo tỉnh
export const getDistrictsByProvince = async (provinceCode: number): Promise<District[]> => {
  const response = await axiosInstance.get(`/p/${provinceCode}?depth=2`);
  return response.data.districts || [];
};

// Lấy danh sách phường/xã theo quận
export const getWardsByDistrict = async (districtCode: number): Promise<Ward[]> => {
  const response = await axiosInstance.get(`/d/${districtCode}?depth=2`);
  return response.data.wards || [];
};
