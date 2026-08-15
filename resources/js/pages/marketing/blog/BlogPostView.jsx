import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Chip, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

const BlogPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.axios.get(`/api/marketing/blog-posts/${id}`);
        setPost(res.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <Box p={3} textAlign="center">Loading...</Box>;
  if (!post) return <Typography>Not found</Typography>;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/marketing/blog")} sx={{ mb: 2 }}>Back</Button>
      <Card>
        <CardContent>
          <Typography variant="h4">{post.title}</Typography>
          <Box display="flex" gap={1} my={1}>
            {post.category && <Chip label={post.category} size="small" />}
            <Chip label={post.status} size="small" color={post.status === "published" ? "success" : "warning"} />
            {post.shared_to_facebook && <Chip label="Shared to Facebook" size="small" sx={{ bgcolor: "#1877F2", color: "#fff" }} />}
            {post.shared_to_instagram && <Chip label="Shared to Instagram" size="small" sx={{ bgcolor: "#E4405F", color: "#fff" }} />}
          </Box>
          <Typography variant="body2" color="text.secondary" mb={2}>
            By {post.creator?.name} {post.published_at ? `• ${new Date(post.published_at).toLocaleDateString()}` : ""}
          </Typography>
          {post.excerpt && <Typography variant="subtitle1" color="text.secondary" mb={2}>{post.excerpt}</Typography>}
          {post.featured_image && <Box component="img" src={post.featured_image} alt="" sx={{ width: "100%", maxHeight: 500, objectFit: "cover", borderRadius: 2, mb: 2 }} />}
          {post.video_url && (
            <Box sx={{ position: "relative", width: "100%", aspectRatio: "16/9", bgcolor: "#000", borderRadius: 2, overflow: "hidden", mb: 2, boxShadow: "0 8px 30px rgba(0,0,0,.15)" }}>
              <video src={post.video_url} controls playsInline style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "block" }} />
            </Box>
          )}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default BlogPostView;