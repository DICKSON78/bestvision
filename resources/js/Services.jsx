import React, { useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import {
  Healing as TreatmentIcon,
  Groups as OutreachIcon,
  WaterDrop as WaterDropIcon,
  ChildCare as ChildCareIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SEO from './components/SEO';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Enhanced Color Scheme - Blue/Teal Theme
const colors = {
  primary: '#1E88E5',
  primaryLight: '#4FC3F7',
  primaryDark: '#004D40',
  secondary: '#00ACC1',
  secondaryLight: '#4dd0e1',
  secondaryDark: '#0097a7',
  white: '#FFFFFF',
  offWhite: '#F5FAFF',
  lightGray: '#E9ECEF',
  mediumGray: '#DEE2E6',
  textPrimary: '#0D2B45',
  textSecondary: '#7A8A9A',
  textDarkGray: '#4A4A4A',
  darkCharcoal: '#0D2B45',
  borderLight: '#E0EAF3',
  success: '#2ECC71',
  info: '#00ACC1',
  warning: '#FFC107',
};

const Services = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const servicesRef = useRef([]);
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);

  const services = [
    {
      id: 'comprehensive-eye-exams',
      icon: TreatmentIcon,
      title: 'Comprehensive Eye Exams & Vision Testing',
      description: 'Our comprehensive eye examination service utilizes state-of-the-art diagnostic equipment and advanced techniques to provide a thorough assessment of your vision and eye health. Our experienced optometrists conduct detailed evaluations to detect early signs of eye diseases, assess visual acuity, evaluate binocular vision, and assess overall ocular health. Each examination is tailored to your individual needs, age, and medical history, ensuring personalized care recommendations that support optimal vision throughout your life.',
      features: [
        'Complete eye examination and assessment',
        'Digital retinal imaging and screening',
        'Visual acuity testing and refraction',
        'Glaucoma and cataract screening',
        'Dry eye assessment and management',
        'Color vision testing',
        'Binocular vision assessment',
        'Personalized vision care recommendations',
      ],
      image: '/images/services-vision-testing.jpeg',
      color: '#1E88E5',
    },
    {
      id: 'contact-lens-fitting',
      icon: TreatmentIcon,
      title: 'Contact Lens Fitting & Consultations',
      description: 'Our contact lens fitting service provides expert care for patients seeking comfortable and clear vision with contact lenses. Our skilled optometrists use modern fitting techniques and comprehensive pre-fitting evaluations to ensure optimal lens selection and fit. We manage a wide range of contact lens needs including daily wear, toric lenses for astigmatism, multifocal lenses, and specialty lenses. Follow-up care and detailed instructions ensure proper lens use and eye health.',
      features: [
        'Comprehensive pre-fitting eye examination',
        'Wide range of contact lens options',
        'Toric lenses for astigmatism',
        'Multifocal and bifocal contact lenses',
        'Proper lens handling and hygiene instruction',
        'Trial lens evaluation period',
        'Follow-up appointments for optimal fit',
        'Management of contact lens-related complications',
      ],
      image: '/images/gallery-staff-at-work.jpeg',
      color: '#764ba2',
    },
    {
      id: 'eyewear-optical',
      icon: TreatmentIcon,
      title: 'Eyewear & Optical Services',
      description: 'Our eyewear and optical service specializes in providing high-quality prescription glasses and frames to meet your vision needs. Using precision lens crafting technology, we offer single vision, bifocal, and progressive lenses with a variety of lens coatings. Our experienced optical team guides you through frame selection, ensuring the perfect combination of style, comfort, and visual clarity for everyday wear.',
      features: [
        'Comprehensive frame styling and selection guidance',
        'Single vision, bifocal and progressive lenses',
        'Anti-glare, scratch-resistant and UV protective coatings',
        'Precision lens crafting and fitting',
        'Frame adjustments and repairs',
        'Prescription sunglasses and protective eyewear',
        'Digital screen protection lenses',
        'Quality assurance and satisfaction guarantee',
      ],
      image: '/images/services-glasses-frames.jpeg',
      color: '#f093fb',
    },
    {
      id: 'vision-therapy',
      icon: WaterDropIcon,
      title: 'Vision Therapy & Orthoptics',
      description: 'Our vision therapy service provides specialized programs to improve visual skills and processing abilities. Using advanced therapeutic techniques and exercises, we treat binocular vision disorders, convergence insufficiency, amblyopia (lazy eye), and strabismus (squint). Vision therapy helps patients develop or enhance visual skills, improve eye coordination, and alleviate symptoms such as eye strain, headaches, and difficulty reading.',
      features: [
        'Binocular vision disorder assessment',
        'Convergence insufficiency treatment',
        'Amblyopia (lazy eye) therapy',
        'Strabismus (squint) management',
        'Visual perceptual training',
        'Eye tracking and focusing exercises',
        'Personalized home exercise programs',
        'Progress monitoring and adjustment',
      ],
      image: '/images/services-vision-testing.jpeg',
      color: '#4facfe',
    },
    {
      id: 'low-vision-rehabilitation',
      icon: TreatmentIcon,
      title: 'Low Vision Aids & Rehabilitation',
      description: 'Our low vision rehabilitation services provide comprehensive solutions for individuals with significant vision impairment. We offer low vision assessments, prescribe specialized optical and electronic aids including magnifiers, telescopic systems, and adaptive technology. Using high-quality devices and personalized training, we help patients maximize their remaining vision, maintain independence, and improve quality of life.',
      features: [
        'Comprehensive low vision assessment',
        'Prescription of low vision aids and devices',
        'Magnifiers and telescopic systems',
        'Adaptive technology and training',
        'Lighting and contrast optimization',
        'Daily living skills training',
        'Referral to support services',
        'Ongoing follow-up and support',
      ],
      image: '/images/services-glasses-frames.jpeg',
      color: '#43e97b',
    },
    {
      id: 'pediatric-community-outreach',
      icon: OutreachIcon,
      title: 'Pediatric Eye Care & Community Outreach',
      description: 'We are deeply committed to improving eye health awareness in our community through comprehensive preventive programs and children\'s vision services. Our services include gentle eye care for children, vision screening programs, and educational programs for proper eye health. We conduct school outreach programs, community health education, and provide accessible preventive care to promote lifelong healthy vision for everyone.',
      features: [
        'Children\'s eye check-ups and treatment',
        'School vision screening programs',
        'Amblyopia detection and treatment',
        'Refractive error correction for children',
        'Eye health education and demonstrations',
        'Community outreach initiatives',
        'Dietary advice for eye health',
        'Preventive care for all ages',
      ],
      image: '/images/appointment-receptionist.jpeg',
      color: '#ff6b6b',
    },
  ];

  const serviceCategories = [
    'Comprehensive Eye Exams',
    'Contact Lens Fitting',
    'Eyewear & Optical',
    'Vision Therapy',
    'Low Vision Aids',
    'Cataract Screening',
    'Pediatric Eye Care',
    'Community Outreach',
  ];

  const recentServices = [
    { title: 'Modern Retinal Imaging Technology', image: '/images/services-vision-testing.jpeg' },
    { title: 'Frame Styling Consultation', image: '/images/services-glasses-frames.jpeg' },
    { title: 'Professional Eye Care Team', image: '/images/gallery-staff-at-work.jpeg' },
  ];

  const popularTags = [
    'Eye Check-ups',
    'Vision Health',
    'Contact Lenses',
    'Eyewear',
    'Cataract Screening',
    'Best Vision',
    'Tanzania',
    'Eye Care',
  ];

  useEffect(() => {
    // Hero section animation - only animate position, keep opacity at 1
    if (heroRef.current) {
      const heroElements = heroRef.current.querySelectorAll('.hero-animate');
      gsap.set(heroElements, { opacity: 1, y: 0 });
      gsap.from(heroElements, {
        y: 40,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }

    // Services cards animation - only animate position/scale, keep opacity at 1
    servicesRef.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, { opacity: 1, y: 0 });
        gsap.from(ref, {
          scrollTrigger: {
            trigger: ref,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          duration: 0.8,
          y: 60,
          scale: 0.9,
          ease: 'back.out(1.7)',
          delay: index * 0.1,
        });
      }
    });

    // Section animation - only animate position, keep opacity at 1
    if (sectionRef.current) {
      gsap.set(sectionRef.current, { opacity: 1, y: 0 });
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
        duration: 1,
        y: 30,
        ease: 'power2.out',
      });
    }

    // CTA section animation - only animate position, keep opacity at 1
    if (ctaRef.current) {
      const ctaElements = ctaRef.current.querySelectorAll('.cta-animate');
      gsap.set(ctaElements, { opacity: 1, y: 0 });
      gsap.from(ctaElements, {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
        },
        duration: 1,
        y: 50,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }

    // Cleanup
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa !important', pt: { xs: '56px', sm: '64px' } }}>
      <SEO 
        title="Our Services - Best Vision EyeCare | Comprehensive Eye Care Solutions in Tanzania"
        description="Best Vision EyeCare offers comprehensive eye care services including eye examinations, diagnosis & treatment of eye conditions, vision testing, contact lens fitting, eyewear, vision therapy, cataract screening, and community outreach programs in Mwanza, Tanzania."
        keywords="eye care services Tanzania, optometrist Mwanza, eye examination, vision testing, contact lenses, eyewear, cataract screening, eye clinic services, Best Vision EyeCare services"
      />
      <Navbar />
      
      {/* Hero Section - Light Blue/Purple Gradient Background - Two Column Layout */}
      <Box
        ref={heroRef}
        sx={{
          background: 'linear-gradient(135deg, #E8F4F8 0%, #F0E8FF 100%)',
          color: '#212529',
          pt: 0,
          pb: { xs: 5, md: 7 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pt: { xs: 4, md: 5 } }}>
          <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center">
            {/* Left Column - Heading and Primary Content */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography
                  className="hero-animate"
                  variant="overline"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: colors.primary,
                    textTransform: 'uppercase',
                    mb: 1.5,
                    display: 'block',
                    opacity: 1,
                  }}
                >
                  Professional Eye Care
                </Typography>
                <Typography
                  className="hero-animate"
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem', lg: '3.25rem' },
                    fontWeight: 900,
                    mb: 2.5,
                    color: `${colors.darkCharcoal} !important`,
                    letterSpacing: '-0.02em',
                    background: `linear-gradient(135deg, ${colors.darkCharcoal} 0%, ${colors.primary} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    opacity: 1,
                    lineHeight: 1.2,
                  }}
                >
                  Our Services
                </Typography>
                <Typography
                  className="hero-animate"
                  variant="body1"
                  sx={{
                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                    color: '#4A4A4A !important',
                    lineHeight: 1.8,
                    mb: 2,
                    opacity: 1,
                  }}
                >
                    At Best Vision EyeCare, we provide comprehensive, patient-centered eye care services designed to preserve and enhance your vision. Our experienced team of optometrists utilizes state-of-the-art technology and evidence-based practices to deliver exceptional care tailored to your unique needs.
                </Typography>
                <Typography
                  className="hero-animate"
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: `${colors.textSecondary} !important`,
                    lineHeight: 1.7,
                    opacity: 1,
                  }}
                >
                    From routine eye exams to specialized treatments including contact lens fitting, eyewear dispensing, vision therapy, low vision rehabilitation, and community health initiatives, we are committed to supporting optimal vision and eye health for individuals and families throughout Tanzania.
                </Typography>
              </Box>
            </Grid>

            {/* Right Column - Secondary Content */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography
                  className="hero-animate"
                  variant="body1"
                  sx={{
                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                    color: '#4A4A4A !important',
                    lineHeight: 1.8,
                    mb: 2.5,
                    opacity: 1,
                  }}
                >
                    Our comprehensive range of services includes advanced diagnostic capabilities, personalized treatment plans, modern optical solutions, and accessible community programs, all delivered with professionalism, compassion, and the highest standards of clinical excellence.
                </Typography>
                <Box
                  className="hero-animate"
                  sx={{
                    opacity: 1,
                    p: { xs: 2, md: 3 },
                    bgcolor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 2,
                    borderLeft: `4px solid ${colors.primary}`,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: `${colors.textSecondary} !important`,
                        lineHeight: 1.7,
                      }}
                    >
                      <strong style={{ color: colors.darkCharcoal }}>What We Offer:</strong>
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5, color: '#4A4A4A' }}>
                      <Typography component="li" variant="body2" sx={{ mb: 1, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.7 }}>
                        Comprehensive eye examination
                      </Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.7 }}>
                        Vision testing & contact lens fitting
                      </Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.7 }}>
                        Diagnose, manage and treat eye conditions
                      </Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.7 }}>
                        Eyewear dispensing & optical services
                      </Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.7 }}>
                        Vision therapy & low vision aids
                      </Typography>
                      <Typography component="li" variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.7 }}>
                        Outreach & Prevention Programs
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section - Two Column Layout - Light Blue/Purple Gradient */}
      <Box 
        ref={sectionRef}
        sx={{ 
          py: { xs: 5, md: 7 },
          background: 'linear-gradient(135deg, #E8F4F8 0%, #F0E8FF 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem', lg: '2.5rem' },
                fontWeight: 800,
                mb: 1.5,
                color: `${colors.darkCharcoal} !important`,
              }}
            >
              Comprehensive Eye Care Services
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                color: '#4A4A4A !important',
                maxWidth: 700,
                mx: 'auto',
              }}
            >
               Explore our range of professional services designed to support your vision health
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Left Column - Main Services Content */}
            <Grid size={{ xs: 12, lg: 8 }}>
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card
                    key={service.id}
                    ref={(el) => (servicesRef.current[index] = el)}
                    sx={{
                      borderRadius: '16px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                      border: '1px solid #e0e0e0',
                      bgcolor: 'white !important',
                      overflow: 'hidden',
                      mb: { xs: 1.5, md: 2 },
                      transition: 'all 0.3s',
                      position: 'relative',
                      zIndex: 1,
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                      '& *': {
                        color: 'inherit',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: { xs: 250, sm: 300, md: 380, lg: 400 },
                        overflow: 'hidden',
                        bgcolor: '#f0f0f0',
                        position: 'relative',
                        '&:hover img': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={service.image}
                        alt={service.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
                          transition: 'transform 0.3s ease',
                        }}
                        onError={(e) => {
                          e.target.src = '/images/clinic-exterior-building.jpeg';
                          e.target.onerror = null;
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 }, color: '#333' }}>
                      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          icon={<IconComponent sx={{ fontSize: '1rem !important', color: service.color }} />}
                          label={service.title.split(' ')[0]}
                          size="small"
                          sx={{
                            bgcolor: `${service.color}15`,
                            color: service.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Stack>

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          mb: 2,
                          color: '#1C1C1C !important',
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          lineHeight: 1.3,
                        }}
                      >
                        {service.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          color: '#4A4A4A !important',
                          lineHeight: 1.8,
                          fontSize: { xs: '0.95rem', md: '1rem' },
                        }}
                      >
                        {service.description}
                      </Typography>
                      
                      {/* Features */}
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: '#1C1C1C !important',
                            fontSize: '1rem',
                          }}
                        >
                          Service Features:
                        </Typography>
                        <Grid container spacing={2}>
                          {service.features.map((feature, idx) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <CheckIcon
                                  sx={{
                                    color: service.color,
                                    fontSize: 20,
                                    mt: 0.25,
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#4A4A4A !important',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.7,
                                  }}
                                >
                                  {feature}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/appointment')}
                        sx={{
                          bgcolor: service.color,
                          color: 'white',
                          fontWeight: 700,
                          px: 4,
                          py: 1.5,
                          borderRadius: '8px',
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: service.color,
                            opacity: 0.9,
                          },
                        }}
                      >
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Grid>

            {/* Right Column - Sidebar (No Search Bar) */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ position: { xs: 'relative', lg: 'sticky' }, top: { lg: 100 } }}>
                {/* Recent Services */}
                <Card
                  sx={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #e0e0e0',
                    bgcolor: 'white !important',
                    mb: 3,
                    position: 'relative',
                    zIndex: 1,
                    '& *': {
                      color: 'inherit',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, color: '#333' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: '#1A4A6B !important',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Recent Services
                    </Typography>
                    <Stack spacing={2}>
                      {recentServices.map((service, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            gap: 2,
                            cursor: 'pointer',
                            transition: 'opacity 0.3s',
                            '&:hover': {
                              opacity: 0.7,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 70,
                              height: 70,
                              borderRadius: '8px',
                              overflow: 'hidden',
                              bgcolor: '#f0f0f0',
                              flexShrink: 0,
                              position: 'relative',
                            }}
                          >
                            <Box
                              component="img"
                              src={service.image}
                              alt={service.title}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                objectPosition: 'center',
                                display: 'block',
                              }}
                              onError={(e) => {
                                e.target.src = '/images/clinic-exterior-building.jpeg';
                                e.target.onerror = null;
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.875rem',
                              color: '#4A4A4A !important',
                              lineHeight: 1.5,
                              flex: 1,
                            }}
                          >
                            {service.title}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Service Categories */}
                <Card
                  sx={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #e0e0e0',
                    bgcolor: 'white !important',
                    mb: 3,
                    position: 'relative',
                    zIndex: 1,
                    '& *': {
                      color: 'inherit',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, color: '#333' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: '#1A4A6B !important',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Service Categories
                    </Typography>
                    <Stack spacing={1}>
                      {serviceCategories.map((category, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            py: 0.5,
                            cursor: 'pointer',
                            color: '#555',
                            transition: 'color 0.3s',
                            '&:hover': {
                              color: colors.primary,
                            },
                          }}
                        >
                          <ArrowForwardIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2" sx={{ color: '#555 !important' }}>
                            {category}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card
                  sx={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #e0e0e0',
                    bgcolor: 'white !important',
                    position: 'relative',
                    zIndex: 1,
                    '& *': {
                      color: 'inherit',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, color: '#333' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: `${colors.darkCharcoal} !important`,
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Popular Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {popularTags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: '#f0f0f0',
                            color: '#555',
                            '&:hover': {
                              bgcolor: colors.primary,
                              color: 'white',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section - Light Blue/Purple Gradient */}
      <Box
        ref={ctaRef}
        sx={{
          py: { xs: 8, md: 10 },
          background: 'linear-gradient(135deg, #E8F4F8 0%, #F0E8FF 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(102, 126, 234, 0.08) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Card
            className="cta-animate"
            sx={{
              borderRadius: '24px',
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              bgcolor: 'white',
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              opacity: 1,
            }}
          >
            <Typography
              className="cta-animate"
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: '#1A4A6B !important',
                fontSize: { xs: '1.5rem', md: '2rem' },
                opacity: 1,
              }}
            >
              Ready to Schedule Your Appointment?
            </Typography>
            <Typography 
              className="cta-animate"
              variant="body1" 
              sx={{ 
                mb: 4, 
                color: '#555 !important',
                fontSize: '1rem',
                lineHeight: 1.8,
                maxWidth: 600,
                mx: 'auto',
                opacity: 1,
              }}
            >
               Experience world-class eye care with our expert team. Book your appointment today and take the first step towards better vision health and clear sight.
            </Typography>
            <Stack 
              className="cta-animate"
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              sx={{ opacity: 1 }}
            >
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/appointment')}
                sx={{
                  bgcolor: colors.primary,
                  color: 'white',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#004D40',
                  },
                }}
              >
                Book Appointment Now
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/contact')}
                sx={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: colors.primary,
                    color: 'white',
                  },
                }}
              >
                Call us now
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Services;
