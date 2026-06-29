import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, TextField, Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AnnouncementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileRef = useRef();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "", status: "draft",
  });
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState("");
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  useEffect(() => {
    (async () => {
      try {
        const res = await window.axios.get("/api/marketing/categories");
        setCategories(res.data.data || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const res = await window.axios.get(`/api/marketing/announcements/${id}`);
          const d = res.data.data;
          setForm({
            title: d.title || "",
            description: d.description || "",
            category: d.category || "",
            status: d.status || "draft",
          });
          if (d.file_name) setExistingFile(d.file_name);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
      })();
    }
  }, [id]);

  const handleCreateCategory = async () => {
    try {
      const res = await window.axios.post("/api/marketing/categories", newCategory);
      setCategories([...categories, res.data.data]);
      setForm({ ...form, category: newCategory.name });
      setDialogOpen(false);
      setNewCategory({ name: "", description: "" });
    } catch (e) {
      alert("Error creating category");
    }
  };

  const handleChange = (e) => {
    if (e.target.value === "__add_new__") {
      setDialogOpen(true);
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("status", form.status);
      if (file) fd.append("file", file);
      if (isEdit) fd.append("_method", "PUT");

      const url = isEdit
        ? `/api/marketing/announcements/${id}`
        : "/api/marketing/announcements";
      await window.axios.post(url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/marketing/announcements");
    } catch (e) {
      console.error(e);
      alert("Error saving announcement");
    } finally {
      setSaving(false);
    }
  };

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "link"],
      ["clean"],
    ],
  }), []);

  if (loading) return <Box p={3} textAlign="center">Loading...</Box>;

  return (
    <Box pt={{ xs: 2, sm: 3 }}>
      <Typography variant="h5" mb={2}>{isEdit ? "Edit Announcement" : "New Announcement"}</Typography>
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} required />

              <TextField fullWidth select label="Category" name="category" value={form.category} onChange={handleChange}>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
                ))}
                <MenuItem value="__add_new__">
                  <Box display="flex" alignItems="center" gap={0.5} color="primary.main">
                    <Add fontSize="small" /> Add new category
                  </Box>
                </MenuItem>
              </TextField>

              <Box>
                <Typography variant="subtitle2" mb={0.5}>Description</Typography>
                <Box sx={{ '& .ql-editor': { minHeight: 250 } }}>
                  <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={(v) => setForm({ ...form, description: v })}
                    modules={quillModules}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" mb={0.5}>Attachment</Typography>
                <Button variant="outlined" component="label">
                  {file ? file.name : existingFile ? "Change file" : "Choose file"}
                  <input type="file" hidden ref={fileRef} onChange={(e) => setFile(e.target.files[0])} />
                </Button>
                {existingFile && !file && (
                  <Typography variant="caption" ml={1} color="text.secondary">{existingFile}</Typography>
                )}
              </Box>

              <TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </TextField>

              <Box display="flex" gap={2}>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outlined" onClick={() => navigate("/marketing/announcements")}>Cancel</Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Category</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField fullWidth label="Name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} required />
            <TextField fullWidth label="Description" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} multiline rows={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateCategory} disabled={!newCategory.name}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnouncementForm;
