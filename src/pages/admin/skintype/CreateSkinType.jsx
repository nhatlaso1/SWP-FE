import React, { useEffect, useState } from "react";
import {
  createSkinType,
  getSkinTypeById,
  updateSkinType,
} from "../../../store/skintype.api";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useStore } from "../../../store";

export default function CreateSkinType() {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id nếu là chế độ update/view
  const token = useStore((state) => state.profile.user?.token);
  const isEditMode = Boolean(id);

  const [skinType, setSkinType] = useState({
    skinTypeId: 0,
    skinTypeName: "",
    priority: 0,
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchSkinType = async () => {
        try {
          const skinTypeId = Number(id);
          const data = await getSkinTypeById(skinTypeId);
          if (data) {
            setSkinType({
              skinTypeId: data.skinTypeId || 0,
              skinTypeName: data.skinTypeName || "",
              priority: data.priority || 0,
            });
          }
        } catch (error) {
          console.error("Error fetching skin type:", error);
        }
      };
      fetchSkinType();
    }
  }, [id, isEditMode]);

  const handleChange = (field, value) => {
    setSkinType((prev) => ({
      ...prev,
      [field]: field === "priority" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateSkinType(skinType, token);
      } else {
        await createSkinType(skinType, token);
      }
      navigate("/admin/skintypes");
    } catch (error) {
      console.error("Error saving skinType:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? "Update Skin Type" : "Create Skin Type"}
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={6}>
          <TextField
            label="Skin Type Name"
            fullWidth
            value={skinType.skinTypeName}
            onChange={(e) => handleChange("skinTypeName", e.target.value)}
            placeholder="Enter skin type name"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Priority"
            type="number"
            fullWidth
            value={skinType.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            placeholder="Enter priority (number)"
          />
        </Grid>
      </Grid>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        {isEditMode ? "Update Skin Type" : "Create Skin Type"}
      </Button>
    </Box>
  );
}
