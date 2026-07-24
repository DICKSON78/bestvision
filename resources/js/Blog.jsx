import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Skeleton,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './Footer';
import SEO from './components/SEO';

const Blog = () => {
  const navigate = useNavigate();
  const [topStories, setTopStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'MICHEZO',
    'MATUKIO',
    'Burudani',
    'MAKALA',
    'Habari',
    'Top story',
  ];

  useEffect(() => {
    fetchTopStories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, selectedCategory]);

  const fetchTopStories = async () => {
    try {
      const res = await fetch('/api/blog/top-stories');
      const data = await res.json();
      if (data.data) {
        setTopStories(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch top stories:', err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, per_page: 12 });
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('q', searchQuery);

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();
      if (data.data) {
        setPosts(data.data.data || []);
        setTotalPages(data.data.last_page || 1);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const extractFirstImage = (html) => {
    if (!html) return null;
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % topStories.length);
  }, [topStories.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + topStories.length) % topStories.length);
  }, [topStories.length]);

  useEffect(() => {
    if (topStories.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [topStories.length, nextSlide]);

  const currentStory = topStories[currentSlide];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SEO
        title="Eye Health Blog - Best Vision Eyecare"
        description="Stay informed with the latest eye health tips, news, and expert advice from Best Vision Eyecare in Mwanza, Tanzania."
      />
      <Navbar />

      <Box sx={{ flex: 1 }}>
        {/* Blog Header */}
        <Box className="blog-header">
          <Container maxWidth="lg">
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Eye Health Blog
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stay informed with the latest news, eye health tips, and expert advice
            </Typography>

            {/* Category Chips */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Chip
                label="All"
                onClick={() => { setSelectedCategory(''); setPage(1); }}
                variant={!selectedCategory ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 600,
                  cursor: 'pointer',
                  ...(!selectedCategory && {
                    bgcolor: 'var(--brand)',
                    color: '#fff',
                    '&:hover': { bgcolor: 'var(--brand-dark)' },
                  }),
                }}
              />
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1); }}
                  variant={selectedCategory === cat ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 600,
                    cursor: 'pointer',
                    ...(selectedCategory === cat && {
                      bgcolor: 'var(--brand)',
                      color: '#fff',
                      '&:hover': { bgcolor: 'var(--brand-dark)' },
                    }),
                  }}
                />
              ))}
            </Box>
          </Container>
        </Box>

        <Box className="blog-content">
          <Container maxWidth="lg">

            {/* ========== TOP STORIES HERO SLIDER ========== */}
            {topStories.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <Box className="section-heading">
                  <span className="section-heading-icon">🔥</span>
                  Top Stories
                </Box>

                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    bgcolor: '#000',
                    aspectRatio: { xs: '16/12', md: '16/7' },
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (currentStory) navigate(`/blog/${currentStory.slug}`);
                  }}
                >
                  {/* Slides */}
                  {topStories.map((story, idx) => (
                    <Box
                      key={story.id}
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        opacity: idx === currentSlide ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out',
                        pointerEvents: idx === currentSlide ? 'auto' : 'none',
                      }}
                    >
                      <Box
                        component="img"
                        src={story.featured_image || extractFirstImage(story.content)}
                        alt={story.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      {/* Gradient Overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.05) 70%)',
                        }}
                      />
                      {/* Text Content */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: { xs: 3, md: 4 },
                          color: '#fff',
                        }}
                      >
                        <Chip
                          label={story.category}
                          size="small"
                          sx={{
                            mb: 1.5,
                            bgcolor: 'var(--brand)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        />
                        <Typography
                          variant="h4"
                          fontWeight={800}
                          sx={{
                            fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' },
                            lineHeight: 1.2,
                            mb: 1,
                            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          }}
                        >
                          {story.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', opacity: 0.85 }}>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PersonIcon sx={{ fontSize: 14 }} />
                            {story.creator?.full_name || 'Author'}
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TimeIcon sx={{ fontSize: 14 }} />
                            {formatDate(story.published_at)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}

                  {/* Navigation Arrows */}
                  {topStories.length > 1 && (
                    <>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        sx={{
                          position: 'absolute',
                          left: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(255,255,255,0.15)',
                          color: '#fff',
                          backdropFilter: 'blur(4px)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                          zIndex: 2,
                        }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        sx={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(255,255,255,0.15)',
                          color: '#fff',
                          backdropFilter: 'blur(4px)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                          zIndex: 2,
                        }}
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </>
                  )}

                  {/* Dots */}
                  {topStories.length > 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        display: 'flex',
                        gap: 0.75,
                        zIndex: 2,
                      }}
                    >
                      {topStories.map((_, idx) => (
                        <Box
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                          sx={{
                            width: idx === currentSlide ? 28 : 10,
                            height: 10,
                            borderRadius: 5,
                            bgcolor: idx === currentSlide ? '#fff' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* ========== LATEST NEWS SECTION ========== */}
            <Box className="news-section" sx={{ mb: 4 }}>
              <Box className="section-heading">
                📰 {selectedCategory || 'Latest News'}
              </Box>

              {loading ? (
                <Grid container spacing={3}>
                  {[...Array(6)].map((_, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
                    </Grid>
                  ))}
                </Grid>
              ) : posts.length === 0 ? (
                <Box className="blog-empty">
                  <Typography variant="h5" fontWeight={700}>
                    No posts found
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Check back later for new articles
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                      <Card
                        className="card blog-card-news"
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                          },
                        }}
                        onClick={() => navigate(`/blog/${post.slug}`)}
                      >
                        {/* Thumbnail */}
                        <Box className="blog-card-img-wrap">
                          <Box
                            component="img"
                            src={post.featured_image || extractFirstImage(post.content) || '/images/eye_exam.jpeg'}
                            alt={post.title}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>

                        {/* Text */}
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: '0 !important', px: 2, pb: 2 }}>
                          <Chip
                            label={post.category}
                            size="small"
                            sx={{
                              alignSelf: 'flex-start',
                              mb: 1,
                              fontWeight: 700,
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              bgcolor: 'rgba(26,91,164,0.08)',
                              color: 'var(--brand)',
                            }}
                          />
                          <Typography
                            className="blog-card-title-news"
                            variant="h6"
                            fontWeight={700}
                            sx={{ fontSize: '16px', lineHeight: 1.3, mb: 0.5 }}
                          >
                            {post.title}
                          </Typography>
                          <Typography
                            className="blog-card-excerpt-news"
                            variant="body2"
                            color="text.secondary"
                            sx={{ flex: 1, mb: 1.5, fontSize: '13px', lineHeight: 1.5 }}
                          >
                            {post.excerpt || stripHtml(post.content).substring(0, 150) + '...'}
                          </Typography>
                          <Box className="blog-meta">
                            <Typography variant="caption" className="blog-author">
                              {post.creator?.full_name || 'Author'}
                            </Typography>
                            <Typography variant="caption" className="blog-date">
                              {formatDate(post.published_at)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box className="blog-pagination">
                  <button
                    className="btn-page"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    &laquo; Previous
                  </button>
                  <Box className="blog-page-numbers">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`btn-page ${page === i + 1 ? 'active' : ''}`}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </Box>
                  <button
                    className="btn-page"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next &raquo;
                  </button>
                </Box>
              )}
            </Box>

          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Blog;
