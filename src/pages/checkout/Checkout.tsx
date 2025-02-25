import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Province, District, Ward } from "../../types/address";
import { getProvinces, getDistrictsByProvince, getWardsByDistrict } from "../../store/checkout.api";
import "./Checkout.scss";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CartItems from "./CartItems";
import { Button, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  border: '2px solid #ff69b4',
  borderRadius: '8px',
  boxShadow: '0px 4px 15px rgba(255, 105, 180, 0.3)',
  fontWeight: 'bold',
  fontSize: '1.2rem',
}));

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const token = useStore((store) => store.profile.user?.token);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [voucher, setVoucher] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(1375000);
  const [shippingFee, setShippingFee] = useState<number>(0);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getProvinces().then(setProvinces).catch((error) => console.error("Error fetching provinces:", error));
  }, [token, navigate]);

  const handleProvinceChange = (provinceCode: number) => {
    setSelectedProvince(provinceCode);
    setDistricts([]);
    setWards([]);
    getDistrictsByProvince(provinceCode).then(setDistricts).catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (districtCode: number) => {
    setSelectedDistrict(districtCode);
    setWards([]);
    getWardsByDistrict(districtCode).then(setWards).catch((error) => console.error("Error fetching wards:", error));
  };

  const applyVoucher = () => {
    let discountValue = 0;

    switch (voucher) {
      case "SALE50":
        discountValue = 50000;
        break;
      case "SALE100":
        discountValue = 100000;
        break;
      case "SALE150":
        discountValue = 150000;
        break;
      case "SALE200":
        discountValue = 200000;
        break;
      case "PERCENT5":
        discountValue = subtotal * 0.05;
        break;
      case "PERCENT10":
        discountValue = subtotal * 0.1;
        break;
      case "PERCENT15":
        discountValue = subtotal * 0.15;
        break;
      case "PERCENT20":
        discountValue = subtotal * 0.2;
        break;
      case "PERCENT25":
        discountValue = subtotal * 0.25;
        break;
      case "PERCENT30":
        discountValue = subtotal * 0.3;
        break;
      default:
        discountValue = 0;
        break;
    }

    setDiscount(Math.min(discountValue, subtotal));
  };

  const total = subtotal - discount + shippingFee;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={9}>
          <div className="checkout-container">
            <h4>Thông tin liên hệ của bạn</h4>
            <div className="shipping-section">
              <div className="input-group">
                <label htmlFor="name">Họ và tên</label>
                <input type="text" id="name" placeholder="Họ và tên" />
              </div>
              <div className="input-group">
                <label htmlFor="phone">Nhập số điện thoại</label>
                <input type="tel" id="phone" placeholder="Số điện thoại" />
              </div>
            </div>
            <h4>Địa chỉ giao hàng</h4>
            <div className="address-section">
              <div className="input-group">
                <label htmlFor="province">Chọn Tỉnh/Thành Phố</label>
                <select id="province" onChange={(e) => handleProvinceChange(Number(e.target.value))}>
                  <option value="">Chọn Tỉnh/Thành Phố</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>{province.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="district">Chọn Quận/Huyện</label>
                <select id="district" onChange={(e) => handleDistrictChange(Number(e.target.value))} disabled={!selectedProvince}>
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>{district.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="ward">Chọn Phường/Xã</label>
                <select id="ward" disabled={!selectedDistrict}>
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group full-width">
                <label htmlFor="address">Số nhà, đường, khu vực</label>
                <input type="text" id="address" placeholder="Số nhà, đường, khu vực" />
              </div>
            </div>
          </div>
          <Paper elevation={3} className="order-summary-container">
          <div className="order-summary">
              <h4>Nhập mã khuyến mãi hoặc thẻ quà tặng</h4>
              <Box sx={{ width: 500, maxWidth: '100%', display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Nhập mã giảm giá"
                  variant="outlined"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                />
                <button onClick={applyVoucher} style={{ padding: '8px 16px', backgroundColor: '#ff69b4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Áp dụng
                </button>
              </Box>
              <List>
                <ListItem className="price-end">
                  <ListItemText primary="Tạm tính" secondary={`${subtotal.toLocaleString('vi-VN')} đ`} />
                </ListItem>
                <ListItem className="price-end">
                  <ListItemText primary="Giảm giá" secondary={`${discount.toLocaleString('vi-VN')} đ`} />
                </ListItem>
                <ListItem className="price-end">
                  <ListItemText primary="Phí vận chuyển" secondary={`${shippingFee.toLocaleString('vi-VN')} đ`} />
                </ListItem>
              </List>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', margin: '15px' }}>
                <Typography variant="h6" fontWeight="bold">
                  Tổng cộng: {total.toLocaleString('vi-VN')} đ
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ backgroundColor: '#ff69b4' }}
                >
                  Đặt hàng
                </Button>
              </div>
            </div>
          </Paper>

        </Grid>
        <Grid item xs={7}>
          <Paper elevation={3} className="order-summary-container">
            <Item>Order Detail</Item>
            <CartItems />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
