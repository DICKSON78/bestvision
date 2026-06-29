import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostMeta = ({ post }) => (
  <div className="blog-meta">
    <span className="blog-date">{post.published_at ? new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
  </div>
);

const BlogIndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const [postsRes, annRes] = await Promise.all([
          window.axios.get(`/api/blog?per_page=9&page=${page}`),
          window.axios.get("/api/announcements?per_page=10"),
        ]);
        const postsData = postsRes.data?.data ?? postsRes.data ?? [];
        setPosts(Array.isArray(postsData) ? postsData : []);
        setLastPage(postsRes.data?.last_page ?? 1);
        const annData = annRes.data?.data ?? annRes.data ?? [];
        setAnnouncements(Array.isArray(annData) ? annData : []);
      } catch (e) {
        console.error("Blog load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const featured = posts.length > 0 ? posts[0] : null;
  const rest = featured ? posts.slice(1) : [];

  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  return (
    <>
      <section className="blog-header">
        <div className="container">
          <h1>Latest News & Announcements</h1>
          <p className="blog-header-desc">Eye health tips, clinic news, and community updates from Best Vision Eye Care</p>
        </div>
      </section>

      <section className="blog-content">
        <div className="container">
          {loading ? (
            <div className="blog-loading">
              <div className="blog-loading-spinner" />
              <p>Loading articles...</p>
            </div>
          ) : (
            <>
              <section className="news-section">
                <h2 className="section-heading">
                  <svg className="section-heading-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  Recent News
                </h2>

                {posts.length === 0 ? (
                  <div className="blog-empty">
                    <h2>No articles yet</h2>
                    <p>Check back soon for new content.</p>
                  </div>
                ) : (
                  <>
                    {featured && (
                      <article className="blog-featured">
                        <Link to={`/blog/${featured.slug}`} className="blog-featured-link">
                          <div className="blog-featured-img">
                            <img src={featured.featured_image} alt={featured.title} loading="lazy" />
                          </div>
                          <div className="blog-featured-text">
                            {featured.category && <span className="blog-cat">{featured.category}</span>}
                            <h2 className="blog-featured-title">{featured.title}</h2>
                            <p className="blog-featured-excerpt">{featured.excerpt}</p>
                            <PostMeta post={featured} />
                          </div>
                        </Link>
                      </article>
                    )}

                    {rest.length > 0 && (
                      <div className="blog-grid-news">
                        {rest.map((post) => (
                          <article className="blog-card-news" key={post.id}>
                            <Link to={`/blog/${post.slug}`} className="blog-card-link">
                              <div className="blog-card-img-wrap">
                                <img src={post.featured_image} alt={post.title} loading="lazy" />
                              </div>
                              <div className="blog-card-text">
                                {post.category && <span className="blog-cat">{post.category}</span>}
                                <h3 className="blog-card-title-news">{post.title}</h3>
                                <p className="blog-card-excerpt-news">{post.excerpt}</p>
                                <PostMeta post={post} />
                              </div>
                            </Link>
                          </article>
                        ))}
                      </div>
                    )}

                    {lastPage > 1 && (
                      <div className="blog-pagination">
                        <button
                          className="btn btn-page"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                          &larr; Previous
                        </button>
                        <div className="blog-page-numbers">
                          {pages.map((p) => (
                            <button
                              key={p}
                              className={`btn btn-page ${p === page ? "active" : ""}`}
                              onClick={() => setPage(p)}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                        <button
                          className="btn btn-page"
                          disabled={page >= lastPage}
                          onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                        >
                          Next &rarr;
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>

              {announcements.length > 0 && (
                <section className="announcements-section">
                  <h2 className="section-heading">
                    <svg className="section-heading-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    Latest Announcements
                  </h2>
                  <div className="announcements-list">
                    {announcements.map((a) => (
                      <div className="announcement-item" key={a.id}>
                        <div className="announcement-body">
                          <span className="blog-cat">{a.category}</span>
                          <h3 className="announcement-title">{a.title}</h3>
                          {a.description && <p className="announcement-desc" dangerouslySetInnerHTML={{ __html: a.description }} />}
                          <div className="announcement-meta">
                            <span className="blog-date">{a.published_at ? new Date(a.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                          </div>
                        </div>
                        {a.file_path && (
                          <a
                            href={a.file_path}
                            className="btn btn-sm btn-download"
                            download={a.file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            &#8595; Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogIndexPage;
