import React, { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Grid, MenuItem, TextField, Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const BlogPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", category: "", tags: "", featured_image: "", status: "draft",
  });

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const res = await window.axios.get(`/marketing/blog-posts/${id}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await window.axios.put(`/marketing/blog-posts/${id}`, form);
      } else {
        await window.axios.post("/marketing/blog-posts", form);
      }
      navigate("/marketing/blog");
    } catch (e) {
      console.error(e);
      alert("Error saving post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box p={3} textAlign="center">Loading...</Box>;

  return (
    <Box>
      <Typography variant="h5" mb={2}>{isEdit ? "Edit Post" : "New Post"}</Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} multiline rows={2} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Content (HTML)" name="content" value={form.content} onChange={handleChange} multiline rows={12} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Category" name="category" value={form.category} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Tags (comma separated)" name="tags" value={form.tags} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Featured Image URL" name="featured_image" value={form.featured_image} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                  <Button variant="outlined" onClick={() => navigate("/marketing/blog")}>Cancel</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BlogPostForm;