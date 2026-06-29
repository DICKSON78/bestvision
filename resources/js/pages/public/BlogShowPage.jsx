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
        setPost(data?.data ?? data ?? null);
      } catch (e) {
        console.error("Blog post load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <section className="blog-content" style={{ paddingTop: 60 }}>
        <div className="container">
          <div className="blog-loading">
            <div className="blog-loading-spinner" />
            <p>Loading article...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="blog-content" style={{ paddingTop: 60 }}>
        <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
          <h1 style={{ font: "700 26px Georgia, serif", margin: "0 0 10px" }}>Article not found</h1>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>The post you are looking for does not exist or has been removed.</p>
          <Link className="btn btn-primary" to="/blog">Back to Blog</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="blog-header" style={{ borderBottom: "none", marginBottom: 0, paddingBottom: 0 }}>
        <div className="container" style={{ textAlign: "center" }}>
          <Link to="/blog" className="blog-back-link">&larr; Back to News</Link>
          {post.category && <span className="blog-cat" style={{ marginTop: 14, fontSize: 12 }}>{post.category}</span>}
          <h1 style={{ font: "700 36px/1.15 Georgia, serif", margin: "6px 0 14px", color: "var(--text)" }}>{post.title}</h1>
          {post.excerpt && <p style={{ font: "400 17px/1.5 Georgia, serif", color: "var(--muted)", margin: "0 0 16px" }}>{post.excerpt}</p>}
          <div className="blog-meta" style={{ fontSize: 13, color: "#999" }}>
            <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}</span>
            {post.creator && <span>By {post.creator.first_name} {post.creator.last_name}</span>}
          </div>
        </div>
      </section>

      {post.featured_image && (
        <section className="section" style={{ paddingTop: 20, paddingBottom: 0 }}>
          <div className="container">
            <div className="blog-article-image">
              <img src={post.featured_image} alt={post.title} />
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: post.featured_image ? 8 : 24 }}>
        <div className="container">
          <div className="blog-article-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <hr className="sep" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <Link className="blog-back-link" to="/blog">&larr; Back to News</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogShowPage;
