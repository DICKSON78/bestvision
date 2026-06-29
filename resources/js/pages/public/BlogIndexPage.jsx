import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogIndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.axios.get("/api/blog");
        setPosts(res.data.data || res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="badge">BLOG</span>
          <h1>Latest News &amp; Updates</h1>
          <p className="lead">Eye health tips, clinic news, events, and community updates from Best Vision Eye Care.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {loading ? (
            <p>Loading...</p>
          ) : posts.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 40 }}>
              <h2>No posts yet</h2>
              <p className="small">Check back soon for updates.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {posts.map((post) => (
                <div className="card with-thumb" key={post.id}>
                  {post.featured_image && (
                    <div className="thumb">
                      <img alt={post.title} src={post.featured_image} />
                    </div>
                  )}
                  <div style={{ padding: post.featured_image ? "14px 14px 18px" : 0 }}>
                    {post.category && <span className="badge">{post.category}</span>}
                    <h2 style={{ fontSize: 20, margin: "8px 0 6px" }}>
                      <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>{post.title}</Link>
                    </h2>
                    {post.excerpt && <p className="small">{post.excerpt}</p>}
                    <p className="small" style={{ color: "var(--muted)" }}>
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
                      {post.creator?.name ? ` • ${post.creator.name}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogIndexPage;