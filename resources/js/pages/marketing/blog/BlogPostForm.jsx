import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, MenuItem, TextField, Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useToast } from "../../../hooks";

const BlogPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToast = useToast();
  const isEdit = Boolean(id);
  const fileRef = useRef();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [socialText, setSocialText] = useState("");
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", category: "", tags: "",
    featured_image: "", video_url: "", social_links: [], status: "draft",
  });

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
          const res = await window.axios.get(`/api/marketing/blog-posts/${id}`);
          const d = res.data.data;
          setForm({
            title: d.title || "",
            excerpt: d.excerpt || "",
            content: d.content || "",
            category: d.category || "",
            tags: d.tags || "",
            featured_image: d.featured_image || "",
            video_url: d.video_url || "",
            social_links: d.social_links || [],
            status: d.status || "draft",
          });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
      })();
    }
  }, [id]);

  const handleChange = (e) => {
    if (e.target.value === "__add_new__") {
      setDialogOpen(true);
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const fd = new FormData();
      fd.append("video", file);
      const res = await window.axios.post("/api/marketing/blog-posts/upload-video", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, video_url: res.data.data.url });
    } catch (err) {
      addToast({ message: "Video upload failed", severity: "error" });
    } finally {
      setUploadingVideo(false);
    }
  };

  const detectPlatform = (url) => {
    const u = url.toLowerCase();
    if (u.includes("instagram")) return "Instagram";
    if (u.includes("tiktok")) return "TikTok";
    if (u.includes("facebook") || u.includes("fb.com")) return "Facebook";
    if (u.includes("youtube") || u.includes("youtu.be")) return "YouTube";
    if (u.includes("wa.me") || u.includes("whatsapp")) return "WhatsApp";
    if (u.includes("twitter") || u.includes("x.com")) return "X";
    if (u.includes("linkedin")) return "LinkedIn";
    return "Social";
  };

  const handleSocialPaste = () => {
    const urls = socialText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.startsWith("http"));
    const links = urls.map((url) => ({ platform: detectPlatform(url), url }));
    setForm({ ...form, social_links: [...form.social_links, ...links] });
    setSocialText("");
  };

  const handleRemoveSocialLink = (index) => {
    setForm({
      ...form,
      social_links: form.social_links.filter((_, i) => i !== index),
    });
  };

  const handleCreateCategory = async () => {
    try {
      const res = await window.axios.post("/api/marketing/categories", newCategory);
      setCategories([...categories, res.data.data]);
      setForm({ ...form, category: newCategory.name });
      setDialogOpen(false);
      setNewCategory({ name: "", description: "" });
    } catch (e) {
      addToast({ message: "Error creating category", severity: "error" });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await window.axios.post("/api/marketing/blog-posts/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, featured_image: res.data.data.url });
    } catch (err) {
      addToast({ message: "Image upload failed", severity: "error" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await window.axios.put(`/api/marketing/blog-posts/${id}`, form);
      } else {
        await window.axios.post("/api/marketing/blog-posts", form);
      }
      addToast({ message: isEdit ? "Post updated successfully" : "Post created successfully", severity: "success" });
      navigate("/marketing/blog");
    } catch (e) {
      console.error(e);
      addToast({ message: "Error saving post", severity: "error" });
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
    <Box pt={{ xs: 4, sm: 6 }} px={{ xs: 2, sm: 3 }}>
      <Typography variant="h5" mb={2}>{isEdit ? "Edit Post" : "New Post"}</Typography>
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} required />

              <TextField fullWidth label="Excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} multiline rows={2} />

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

              <TextField fullWidth label="Tags (comma separated)" name="tags" value={form.tags} onChange={handleChange} />

              <Box>
                <Typography variant="subtitle2" mb={0.5}>Content</Typography>
                <Box sx={{ '& .ql-editor': { minHeight: 300 } }}>
                  <ReactQuill
                    theme="snow"
                    value={form.content}
                    onChange={(v) => setForm({ ...form, content: v })}
                    modules={quillModules}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" mb={0.5}>Featured Image</Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <TextField
                    fullWidth
                    placeholder="Image URL"
                    name="featured_image"
                    value={form.featured_image}
                    onChange={handleChange}
                  />
                  <Button variant="outlined" component="label" disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" hidden ref={fileRef} onChange={handleImageUpload} />
                  </Button>
                </Box>
                {form.featured_image && (
                  <Box mt={1} maxWidth={300}>
                    <img src={form.featured_image} alt="preview" style={{ width: "100%", borderRadius: 4 }} />
                  </Box>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" mb={0.5}>Video</Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <TextField
                    fullWidth
                    placeholder="Video URL"
                    name="video_url"
                    value={form.video_url}
                    onChange={handleChange}
                  />
                  <Button variant="outlined" component="label" disabled={uploadingVideo}>
                    {uploadingVideo ? "Uploading..." : "Upload"}
                    <input type="file" accept="video/*" hidden onChange={handleVideoUpload} />
                  </Button>
                </Box>
                {form.video_url && (
                  <Box mt={1} maxWidth={400}>
                    <video src={form.video_url} controls style={{ width: "100%", borderRadius: 4, maxHeight: 200 }} />
                  </Box>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" mb={0.5}>Social Media Links</Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Paste URLs (one per line) — platform inatambulika moja kwa moja
                </Typography>
                <Box display="flex" gap={1} alignItems="flex-start">
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    placeholder="https://instagram.com/..."
                    value={socialText}
                    onChange={(e) => setSocialText(e.target.value)}
                  />
                  <Button variant="contained" onClick={handleSocialPaste} disabled={!socialText.trim()}>
                    Add
                  </Button>
                </Box>
                {form.social_links?.length > 0 && (
                  <Box display="flex" flexDirection="column" gap={0.5} mt={1}>
                    {form.social_links.map((link, i) => (
                      <Box key={i} display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600 }}>{link.platform}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, wordBreak: "break-all" }}>{link.url}</Typography>
                        <IconButton size="small" color="error" onClick={() => handleRemoveSocialLink(i)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
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
                <Button variant="outlined" onClick={() => navigate("/marketing/blog")}>Cancel</Button>
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

export default BlogPostForm;
