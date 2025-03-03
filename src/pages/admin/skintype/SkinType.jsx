import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from "@mui/material";
import { useStore } from "../../../store";
import { getAllSkinType } from "../../../store/skintype.api";
import "./SkinType.css";

const SkinType = () => {
  const [skinTypes, setSkinTypes] = useState([]);
  const token = useStore((state) => state.profile.user?.token);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const response = await getAllSkinType(token);
        // Giả sử API trả về dữ liệu dạng { "$values": [...] }
        const skinTypeArray =
          response?.$values && Array.isArray(response.$values)
            ? response.$values
            : Array.isArray(response)
            ? response
            : [];
        setSkinTypes(skinTypeArray);
      } catch (error) {
        console.error("Error fetching skin types:", error);
      }
    };

    fetchSkinTypes();
  }, [token]);

  // Sắp xếp skin types theo skinTypeId tăng dần
  const sortedSkinTypes = [...skinTypes].sort(
    (a, b) => Number(a.skinTypeId) - Number(b.skinTypeId)
  );

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedSkinTypes.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedSkinTypes.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth="lg" className="skin-type-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4">Skin Type List</Typography>
      </Box>

      <TableContainer component={Paper} className="skin-type-table-container">
        <Table className="skin-type-table">
          <TableHead>
            <TableRow>
              <TableCell className="skin-type-cell header-cell">
                Skin Type ID
              </TableCell>
              <TableCell className="skin-type-cell header-cell">
                Skin Type Name
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((skinType) => (
                <TableRow key={skinType.skinTypeId} hover className="skin-type-row">
                  <TableCell className="skin-type-cell">{skinType.skinTypeId}</TableCell>
                  <TableCell className="skin-type-cell">{skinType.skinTypeName}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No skin types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box className="pagination-container">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default SkinType;
