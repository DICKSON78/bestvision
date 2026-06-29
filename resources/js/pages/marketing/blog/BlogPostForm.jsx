import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Box, Button, Card, CardContent, MenuItem, TextField, Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileRef = useRef();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", category: "", tags: "", featured_image: "", status: "draft",
  });

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
            status: d.status || "draft",
          });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
      })();
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      alert("Image upload failed");
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
      navigate("/marketing/blog");
    } catch (e) {
      console.error(e);
      alert("Error saving post");
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
    <Box>
      <Typography variant="h5" mb={2}>{isEdit ? "Edit Post" : "New Post"}</Typography>
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} required />

              <TextField fullWidth label="Excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} multiline rows={2} />

              <TextField fullWidth label="Category" name="category" value={form.category} onChange={handleChange} />

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
    </Box>
  );
};

export default BlogPostForm;
