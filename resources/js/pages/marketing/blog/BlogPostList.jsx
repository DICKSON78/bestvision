import React, { useEffect, useState } from "react";
import {
  Box, Button, Card, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography,
} from "@mui/material";
import { Add, Delete, Edit, OpenInNew, Share, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../hooks";

const BlogPostList = () => {
  const navigate = useNavigate();
  const addToast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sharingId, setSharingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await window.axios.get("/api/marketing/blog-posts", {
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await window.axios.delete(`/api/marketing/blog-posts/${deleteTarget}`);
      addToast({ message: "Post deleted successfully", severity: "success" });
      setDeleteTarget(null);
      fetchData();
    } catch (e) {
      addToast({ message: "Error deleting post", severity: "error" });
      console.error(e);
    }
  };

  const handleShare = async (row) => {
    setSharingId(row.id);
    try {
      const res = await window.axios.post(`/api/marketing/blog-posts/${row.id}/share`, {
        platforms: ["facebook", "instagram"],
      });
      addToast({ message: res.data?.message || "Shared successfully", severity: res.status >= 200 && res.status < 300 ? "success" : "warning" });
      fetchData();
    } catch (e) {
      const msg = e.response?.data?.message || "Error sharing to social media";
      addToast({ message: msg, severity: "warning" });
    } finally {
      setSharingId(null);
    }
  };

  const statusColor = (s) => s === "published" ? "success" : "warning";

  return (
    <Box pt={{ xs: 4, sm: 6 }} px={{ xs: 2, sm: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5">Blog Content Portal</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage content for the public blog — create, edit, and publish posts
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
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/marketing/blog/create")}>
            New Post
          </Button>
        </Box>
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
                    <TableCell>Social</TableCell>
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
                      <TableCell>
                        <Box display="flex" gap={0.5}>
                          {row.shared_to_facebook && (
                            <Tooltip title="Shared to Facebook">
                              <Chip label="FB" size="small" sx={{ bgcolor: "#1877F2", color: "#fff" }} />
                            </Tooltip>
                          )}
                          {row.shared_to_instagram && (
                            <Tooltip title="Shared to Instagram">
                              <Chip label="IG" size="small" sx={{ bgcolor: "#E4405F", color: "#fff" }} />
                            </Tooltip>
                          )}
                          {!row.shared_to_facebook && !row.shared_to_instagram && <span style={{ color: "#999", fontSize: 12 }}>-</span>}
                        </Box>
                      </TableCell>
                      <TableCell>{row.creator?.name || "-"}</TableCell>
                      <TableCell>{row.published_at ? new Date(row.published_at).toLocaleDateString() : "-"}</TableCell>
                      <TableCell align="center">
                        {row.status === "published" && (
                          <Tooltip title={sharingId === row.id ? "Sharing..." : "Share to Social Media"}>
                            <IconButton size="small" disabled={sharingId === row.id} onClick={() => handleShare(row)}>
                              <Share />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/marketing/blog/${row.id}`)}><Visibility /></IconButton></Tooltip>
                        <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/marketing/blog/${row.id}/edit`)}><Edit /></IconButton></Tooltip>
                        {row.status === "published" && (
                          <Tooltip title="View on site">
                            <IconButton size="small" onClick={() => window.open(`/blog/${row.slug}`, "_blank")}>
                              <OpenInNew />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteTarget(row.id)}><Delete /></IconButton></Tooltip>
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
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>Are you sure you want to delete this post?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogPostList;