import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BlogShowPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await window.axios.get(`/api/blog/${slug}`);
        setPost(data.data || data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <section className="hero">
        <div className="container"><p>Loading...</p></div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="hero">
        <div className="container">
          <h1>Post not found</h1>
          <p className="lead">The blog post you are looking for does not exist.</p>
          <Link className="btn btn-primary" to="/blog">Back to Blog</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          {post.category && <span className="badge">{post.category}</span>}
          <h1>{post.title}</h1>
          <p className="lead" style={{ fontSize: 14, color: "var(--muted)" }}>
            {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
            {post.creator?.name ? ` • By ${post.creator.name}` : ""}
          </p>
          {post.excerpt && <p className="lead">{post.excerpt}</p>}
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800, margin: "0 auto" }}>
          {post.featured_image && (
            <div style={{ marginBottom: 24 }}>
              <img alt={post.title} src={post.featured_image} style={{ width: "100%", borderRadius: 12 }} />
            </div>
          )}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          <hr className="sep" style={{ margin: "24px 0" }} />
          <Link className="btn btn-outline" to="/blog">← Back to Blog</Link>
        </div>
      </section>
    </>
  );
};

export default BlogShowPage;