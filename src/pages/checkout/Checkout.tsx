import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../../store";
import { Province, District, Ward } from "../../types/address";
import {
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
} from "../../store/checkout.api";
import { getAllVoucherByCustomerId } from "../../store/voucher.api";
import { createPayment } from "../../store/payment.api"; // adjust path as needed
import "./Checkout.scss";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  MenuItem,
  Box as MuiBox,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CartItem from "./CartItems";

// Define Voucher type
interface Voucher {
  voucherId: number;
  voucherName: string;
  voucherCode: string;
  description: string;
  discountAmount: number;
  startDate: string;
  endDate: string;
  status: boolean;
  minimumPurchase: number;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  border: "2px solid #ff69b4",
  borderRadius: "8px",
  boxShadow: "0px 4px 15px rgba(255, 105, 180, 0.3)",
  fontWeight: "bold",
  fontSize: "1.2rem",
}));

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get payment status from URL if available
  const queryParams = new URLSearchParams(location.search);
  const paymentStatus = queryParams.get("status");

  const token = useStore((state) => state.profile.user?.token);
  const cart = useStore((state) => state.cart.cart);
  const getShippingPrice = useStore((state) => state.getShippingPrice);
  const createOrder = useStore((state) => state.createOrder);
  const clearCart = useStore((state) => state.clearCart);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  // Voucher state
  const [voucher, setVoucher] = useState<number>(0);
  const [voucherList, setVoucherList] = useState<Voucher[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);

  // Contact information
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  // Shipping address
  const [streetAddress, setStreetAddress] = useState<string>("");

  // Payment method: 1 => COD, 2 => VISA/MASTER/ATM
  const [paymentMethodId, setPaymentMethodId] = useState<number>(1);

  // Reference to store orderId after order creation
  const orderIdRef = useRef<number | null>(null);

  // Popup state
  const [showPopup, setShowPopup] = useState<boolean>(false);
  // Loading state for payment verification
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Restore form state if available from location.state
  useEffect(() => {
    if (location.state && (location.state as any).formData) {
      const {
        name,
        phone,
        streetAddress,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        voucher,
      } = (location.state as any).formData;
      setName(name);
      setPhone(phone);
      setStreetAddress(streetAddress);
      setSelectedProvince(selectedProvince);
      setSelectedDistrict(selectedDistrict);
      setSelectedWard(selectedWard);
      setVoucher(voucher);
    }
  }, [location.state]);

  // If URL contains paymentStatus, show loading for 3 seconds then display the popup
  useEffect(() => {
    if (paymentStatus) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowPopup(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);

  // Fetch provinces on mount
  useEffect(() => {
    getProvinces()
      .then(setProvinces)
      .catch((error) => console.error("Error fetching provinces:", error));
  }, [navigate]);

  // Calculate subtotal based on the cart
  useEffect(() => {
    if (cart) {
      const totalPrice = cart.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      );
      setSubtotal(totalPrice);
    }
  }, [cart]);

  useEffect(() => {
    if (!token) return; // If no token, do not call API

    const fetchVoucherList = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllVoucherByCustomerId(token);
        setVoucherList(data);
      } catch (error) {
        setError("Error fetching voucher list.");
        console.error("Error fetching voucher list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoucherList();
  }, [token]);

  // Calculate shipping fee based on selected province and street address
  useEffect(() => {
    const fetchShippingFee = async () => {
      if (!selectedProvince || !streetAddress) {
        setShippingFee(0);
        return;
      }
      const provinceName =
        provinces.find((p) => p.code === selectedProvince)?.name || "";
      const inRegion = provinceName === "Thành phố Hồ Chí Minh";
      const orderDetails = cart.map((item: any) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
      }));
      try {
        const fee = await getShippingPrice(orderDetails, inRegion, token as string);
        setShippingFee(fee);
      } catch (error) {
        console.error("Error fetching shipping fee:", error);
        setShippingFee(0);
      }
    };

    fetchShippingFee();
  }, [selectedProvince, streetAddress, cart, provinces, token, getShippingPrice]);

  const handleProvinceChange = (provinceCode: number) => {
    setSelectedProvince(provinceCode);
    setDistricts([]);
    setWards([]);
    setSelectedDistrict(null);
    setSelectedWard(null);
    getDistrictsByProvince(provinceCode)
      .then(setDistricts)
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (districtCode: number) => {
    setSelectedDistrict(districtCode);
    setWards([]);
    setSelectedWard(null);
    getWardsByDistrict(districtCode)
      .then(setWards)
      .catch((error) => console.error("Error fetching wards:", error));
  };

  const handleWardChange = (wardCode: number) => {
    setSelectedWard(wardCode);
  };

  // Apply voucher discount
  const applyVoucherHandler = () => {
    if (voucher !== 0) {
      const selectedVoucher = voucherList.find((v) => v.voucherId === voucher);
      if (selectedVoucher) {
        // Check if subtotal meets the voucher's minimum purchase requirement
        if (subtotal >= selectedVoucher.minimumPurchase) {
          setDiscount(Math.min(selectedVoucher.discountAmount, subtotal));
        } else {
          alert("Your order total is insufficient to apply this voucher.");
          setDiscount(0);
          setVoucher(0);
        }
      }
    } else {
      setDiscount(0);
      setVoucher(0);
    }
  };

  // Validate full name
  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Full Name cannot be empty.");
    } else {
      setNameError("");
    }
  };

  // Validate phone number
  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("Phone number must be 10 digits and start with 0.");
    } else {
      setPhoneError("");
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
    validateName(value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPhone(value);
    validatePhoneNumber(value);
  };

  const handleStreetAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStreetAddress(event.target.value);
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethodId(Number(event.target.value));
  };

  const total = subtotal - discount + shippingFee;

  // Function to handle order placement
  const handleOrder = async () => {
    // If cart is empty, do not continue
    if (!cart || cart.length === 0) {
      return;
    }

    // If not logged in, save formData and redirect to login
    if (!token) {
      const formData = {
        name,
        phone,
        streetAddress,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        voucher,
      };
      navigate("/login", { state: { from: "/checkout", formData } });
      return;
    }

    if (nameError || phoneError || !name.trim() || !phone) {
      alert("Please enter complete and correct contact information.");
      return;
    }

    const provinceName =
      provinces.find((p) => p.code === selectedProvince)?.name || "";
    const districtName =
      districts.find((d) => d.code === selectedDistrict)?.name || "";
    const wardName = wards.find((w) => w.code === selectedWard)?.name || "";
    const fullAddress = `${streetAddress}, ${wardName}, ${districtName}, ${provinceName}`;
    const inRegion = provinceName === "Thành phố Hồ Chí Minh";

    const requestPayload = {
      paymentMethodId,
      inRegion,
      fullName: name,
      address: fullAddress,
      phoneNumber: phone,
      orderDetailRequests: cart.map((item: any) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = (await createOrder(
        requestPayload,
        voucher,
        token as string
      )) as unknown as { orderId: number };

      console.log("Order created successfully:", response);
      orderIdRef.current = response.orderId;

      // Clear the cart after order creation
      clearCart();

      if (paymentMethodId === 1) {
        // COD: Redirect directly to order success page
        navigate("/order-success");
      } else if (paymentMethodId === 2) {
        // Bank Payment: Call the payment handler
        await handlePayment();
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // Payment handler for bank payment
  const handlePayment = async () => {
    if (!orderIdRef.current) {
      console.error("Missing orderId. Cannot proceed with payment.");
      return;
    }
    try {
      if (!token) {
        console.error("No token found. Please log in.");
        alert("You need to log in to make a payment.");
        return;
      }
      const paymentUrl = await createPayment(orderIdRef.current, token);
      console.log("Received payment URL:", paymentUrl);
      if (paymentUrl && paymentUrl.startsWith("http")) {
        window.location.href = paymentUrl; // Redirect to payment gateway
      } else {
        console.error("Invalid payment URL:", paymentUrl);
        alert("Unable to retrieve payment link. Please try again.");
      }
    } catch (error: any) {
      console.error("Error calling payment API:", error.response || error.message);
      alert("An error occurred while connecting to the payment gateway.");
    }
  };

  // Popup displayed after loading completes (only appears when URL has paymentStatus)
  const renderPopup = () => {
    if (!paymentStatus) return null;
    return (
      <Dialog open={showPopup} onClose={() => { }}>
        <DialogTitle>
          {paymentStatus === "fail"
            ? "Payment Failed"
            : paymentStatus === "success"
              ? "Payment Successful"
              : "Payment"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {paymentStatus === "fail"
              ? "Please check your payment and try again within 3 days."
              : paymentStatus === "success"
                ? "Thank you for your order."
                : "Payment has been completed."}
          </Typography>
        </DialogContent>
        <DialogActions>
          {paymentStatus === "fail" ? (
            <>
              <Button onClick={() => navigate("/")} variant="contained" color="secondary">
                Go to Homepage
              </Button>
              <Button onClick={() => navigate(`/purchase/`)} variant="contained" color="secondary">
                Check Orders
              </Button>
            </>
          ) : paymentStatus === "success" ? (
            <>
              <Button onClick={() => navigate(`/purchase/`)} variant="contained" color="primary">
                Track Order
              </Button>
              <Button onClick={() => navigate("/products")} variant="contained" color="primary">
                Continue Shopping
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/")} variant="contained" color="primary">
                OK
              </Button>
              <Button onClick={() => navigate("/products")} variant="contained" color="primary">
                Continue Shopping
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* If paymentStatus exists in URL, display loading and popup after 3 seconds */}
      {isLoading && (
        <Box className="loading-container" sx={{ textAlign: "center", my: 2 }}>
          <Typography variant="h6">
            Verifying payment information...{" "}
            <img src="/loading-quiz-result.svg" alt="Loading" className="loading-img" />
          </Typography>
        </Box>
      )}
      {renderPopup()}
      <Grid container spacing={2} columns={16}>
        <Grid item xs={9}>
          <div className="checkout-container">
            <h4>Your Contact Information</h4>
            <div className="shipping-section">
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Full Name"
                  value={name}
                  onChange={handleNameChange}
                />
                {nameError && (
                  <span
                    className="error-message"
                    style={{
                      color: "#f44336",
                      marginLeft: "8px",
                      fontSize: "0.9rem",
                      display: "inline-block",
                    }}
                  >
                    {nameError}
                  </span>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="phone">Enter Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={handlePhoneChange}
                />
                {phoneError && (
                  <span
                    className="error-message"
                    style={{
                      color: "#f44336",
                      marginLeft: "8px",
                      fontSize: "0.9rem",
                      display: "inline-block",
                    }}
                  >
                    {phoneError}
                  </span>
                )}
              </div>
            </div>
            <h4>Shipping Address</h4>
            <div className="address-section">
              <div className="input-group">
                <label htmlFor="province">Select Province/City</label>
                <select
                  id="province"
                  onChange={(e) => handleProvinceChange(Number(e.target.value))}
                >
                  <option value="">Select Province/City</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="district">Select District</label>
                <select
                  id="district"
                  onChange={(e) => handleDistrictChange(Number(e.target.value))}
                  disabled={!selectedProvince}
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="ward">Select Ward</label>
                <select
                  id="ward"
                  onChange={(e) => handleWardChange(Number(e.target.value))}
                  disabled={!selectedDistrict}
                >
                  <option value="">Select Ward</option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group full-width">
                <label htmlFor="address">House Number, Street, Area</label>
                <input
                  type="text"
                  id="address"
                  placeholder="House Number, Street, Area"
                  value={streetAddress}
                  onChange={handleStreetAddressChange}
                />
              </div>
            </div>
          </div>
          <Paper elevation={3} className="order-summary-container">
            <div className="order-summary">
              <h4>Payment Method</h4>
              <FormControl>
                <RadioGroup
                  aria-labelledby="payment-method"
                  name="payment-method"
                  value={paymentMethodId.toString()}
                  onChange={handlePaymentMethodChange}
                >
                  <FormControlLabel value="1" control={<Radio />} label="Cash on Delivery (COD)" />
                  <FormControlLabel value="2" control={<Radio />} label="Pay with VISA/MASTER/ATM" />
                </RadioGroup>
              </FormControl>
            </div>
          </Paper>
          <Paper elevation={3} className="order-summary-container">
            <div className="order-summary">
              <h4>Available Discounts</h4>
              <MuiBox
                sx={{
                  width: 1000,
                  maxWidth: "100%",
                  display: "flex",
                  gap: 1,
                  padding: 1,
                }}
              >
                <TextField
                  select
                  fullWidth
                  label="Select Voucher"
                  variant="outlined"
                  value={voucher}
                  onChange={(e) => setVoucher(Number(e.target.value))}
                >
                  <MenuItem value={0}>None</MenuItem>
                  {voucherList.map((v) => (
                    <MenuItem key={v.voucherId} value={v.voucherId}>
                      {v.voucherName} - {v.discountAmount.toLocaleString("en-US")}₫ off
                    </MenuItem>
                  ))}
                </TextField>
                <button
                  onClick={applyVoucherHandler}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ff69b4",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Apply
                </button>
              </MuiBox>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper elevation={3} className="order-summary-container">
            <Item>Order Detail</Item>
            <Box sx={{ p: 2 }}>
              {cart && cart.length > 0 ? (
                cart.map((product: any) => (
                  <CartItem key={product.productId || product.id} product={product} />
                ))
              ) : (
                <Typography variant="h6" color="error" align="center">
                  Your cart is empty!!!
                </Typography>
              )}
            </Box>
            <div>
              <List>
                <ListItem className="price-end">
                  <ListItemText primary="Subtotal" secondary={`${subtotal.toLocaleString("en-US")} ₫`} />
                </ListItem>
                <ListItem className="price-end">
                  <ListItemText primary="Discount" secondary={`${discount.toLocaleString("en-US")} ₫`} />
                </ListItem>
                <ListItem className="price-end">
                  <ListItemText primary="Shipping Fee" secondary={`${shippingFee.toLocaleString("en-US")} ₫`} />
                </ListItem>
              </List>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "15px", marginTop: "16px" }}>
                <Typography variant="h6" fontWeight="bold">
                  Total: {total.toLocaleString("en-US")} ₫
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleOrder}
                  style={{ backgroundColor: "#ff69b4" }}
                  disabled={
                    Boolean(nameError) ||
                    Boolean(phoneError) ||
                    !name.trim() ||
                    !phone ||
                    !streetAddress.trim() || // Check address input
                    !selectedProvince ||       // Check if province is selected
                    !selectedDistrict ||       // Check if district is selected
                    !selectedWard ||
                    (cart && cart.length === 0)
                  }
                >
                  Place Order
                </Button>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
