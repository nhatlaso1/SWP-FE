import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../store";
import {
  createVoucher,
  getVoucherById,
  updateVoucher,
} from "../../../store/voucher.api";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

export default function VoucherForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id nếu là chế độ update/view
  //const token = useStore((state) => state.profile.user?.token);
  const token = localStorage.getItem("token");
  const isEditMode = Boolean(id);

  const [voucher, setVoucher] = useState({
    voucherId: 0,
    voucherName: "",
    voucherCode: "",
    description: "",
    discountAmount: 0,
    startDate: "",
    endDate: "",
    minimumPurchase: 0,
    status: true,
  });

  useEffect(() => {
    if (isEditMode) {
      const voucherId = Number(id);
      getVoucherById(voucherId, token).then((data) => setVoucher(data));
    }
  }, [id, isEditMode, token]);

  const handleChange = (field, value) => {
    setVoucher((prev) => ({ ...prev, [field]: value }));
    if (field === "voucherName" && !isEditMode) {
      // Tự động tạo voucherCode từ voucherName khi tạo mới
      const generatedCode = value.replace(/\s+/g, "").toUpperCase();
      setVoucher((prev) => ({ ...prev, voucherCode: generatedCode }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateVoucher(voucher, token);
      } else {
        await createVoucher(voucher, token);
      }
      navigate("/admin/vouchers");
    } catch (error) {
      console.error("Error saving voucher:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? "Update Voucher" : "Create Voucher"}
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={6}>
          <TextField
            label="Voucher Name"
            fullWidth
            value={voucher.voucherName}
            onChange={(e) => handleChange("voucherName", e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Voucher Code"
            fullWidth
            value={voucher.voucherCode}
            onChange={(e) => handleChange("voucherCode", e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={voucher.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={4}>
          <TextField
            label="Discount Amount (VND)"
            type="number"
            fullWidth
            value={voucher.discountAmount}
            onChange={(e) =>
              handleChange("discountAmount", Number(e.target.value))
            }
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Minimum Purchase (VND)"
            type="number"
            fullWidth
            value={voucher.minimumPurchase}
            onChange={(e) =>
              handleChange("minimumPurchase", Number(e.target.value))
            }
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            value={voucher.status ? "Active" : "Inactive"}
            onChange={(e) =>
              handleChange("status", e.target.value === "Active")
            }
            fullWidth
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={6}>
          <TextField
            label="Start Date"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={voucher.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="End Date"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={voucher.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </Grid>
      </Grid>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        {isEditMode ? "Update Voucher" : "Create Voucher"}
      </Button>
    </Box>
  );
}
