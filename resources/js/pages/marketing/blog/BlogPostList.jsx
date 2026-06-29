import React, { useEffect, useState } from "react";
import {
  Box, Button, Card, Chip, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography,
} from "@mui/material";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const BlogPostList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await window.axios.get("/marketing/blog-posts", {
        params: { per_page: rowsPerPage, page: page + 1 },
      });
      setData(res.data.data?.data || []);
      setTotal(res.data.data?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, rowsPerPage]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      await window.axios.delete(`/marketing/blog-posts/${id}`);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const statusColor = (s) => s === "published" ? "success" : "warning";

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Blog Posts</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/marketing/blog/create")}>
          New Post
        </Button>
      </Box>
      <Card>
        {loading ? <Box p={3} textAlign="center">Loading...</Box> : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Published</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.category || "-"}</TableCell>
                      <TableCell><Chip label={row.status} size="small" color={statusColor(row.status)} /></TableCell>
                      <TableCell>{row.creator?.name || "-"}</TableCell>
                      <TableCell>{row.published_at ? new Date(row.published_at).toLocaleDateString() : "-"}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/marketing/blog/${row.id}`)}><Visibility /></IconButton></Tooltip>
                        <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/marketing/blog/${row.id}/edit`)}><Edit /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(row.id)}><Delete /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

export default BlogPostList;