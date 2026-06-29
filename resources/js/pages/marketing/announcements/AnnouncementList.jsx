import React, { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip, IconButton, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import { Add, Delete, Edit, OpenInNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AnnouncementList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.axios.get("/api/marketing/categories");
        setCategories(res.data.data || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { per_page: rowsPerPage, page: page + 1 };
      if (categoryFilter) params.category = categoryFilter;
      const res = await window.axios.get("/api/marketing/announcements", { params });
      setData(res.data.data?.data || []);
      setTotal(res.data.data?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, rowsPerPage, categoryFilter]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await window.axios.delete(`/api/marketing/announcements/${id}`);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const statusColor = (s) => s === "published" ? "success" : "warning";

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5">Announcements Portal</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage announcements that appear on the public blog
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<OpenInNew />}
            onClick={() => window.open("/blog", "_blank")}
          >
            View Blog
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/marketing/announcements/create")}>
            New Announcement
          </Button>
        </Box>
      </Box>
      <Box display="flex" gap={2} mb={2}>
        <TextField select label="Filter by category" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }} sx={{ minWidth: 200 }}>
          <MenuItem value="">All</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
          ))}
        </TextField>
      </Box>
      <Card sx={{ width: '100%' }}>
        {loading ? <Box p={3} textAlign="center">Loading...</Box> : (
          <>
            <CardContent sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 1, sm: 1 } }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Published</TableCell>
                      <TableCell align="center" sx={{ width: 120 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.category || "-"}</TableCell>
                        <TableCell><Chip label={row.status} size="small" color={statusColor(row.status)} /></TableCell>
                        <TableCell>{row.published_at ? new Date(row.published_at).toLocaleDateString() : "-"}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/marketing/announcements/${row.id}/edit`)}><Edit /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(row.id)}><Delete /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
          </>
        )}
      </Card>
    </Box>
  );
};

export default AnnouncementList;
