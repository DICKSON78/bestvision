<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Primary Meta Tags -->
    <title>Best Vision Eyecare - Clear Vision for a Brighter Future | Eye Care Clinic in Tanzania</title>
    <meta name="title" content="Best Vision Eyecare - Clear Vision for a Brighter Future | Eye Care Clinic in Mwanza, Tanzania">
    <meta name="description" content="Best Vision Eyecare - Your trusted partner for clear vision and comprehensive eye health. Expert eye exams, contact lens fitting, pediatric eye care, and more.">
    <meta name="keywords" content="eye care, optometrist, eye exam, contact lenses, eye clinic, Mwanza Tanzania, vision care, eye health, pediatric eye care, dry eye treatment, eyewear, best vision eyecare">
    <meta name="author" content="Best Vision Eyecare">
    <meta name="robots" content="index, follow">
    <meta name="language" content="English">
    <meta name="revisit-after" content="7 days">
    <meta name="geo.region" content="TZ-18">
    <meta name="geo.placename" content="Mwanza, Tanzania">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://bestvisioneyecare.com/">
    <meta property="og:title" content="Best Vision Eyecare - Clear Vision for a Brighter Future">
    <meta property="og:description" content="Your trusted partner for clear vision and comprehensive eye health in Natta-Mwanza, Tanzania. Expert eye exams, contact lens fitting, and more.">
    <meta property="og:image" content="{{ asset('images/logo.png') }}">
    <meta property="og:site_name" content="Best Vision Eyecare">
    <meta property="og:locale" content="en_US">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://bestvisioneyecare.com/">
    <meta property="twitter:title" content="Best Vision Eyecare - Clear Vision for a Brighter Future">
    <meta property="twitter:description" content="Your trusted partner for clear vision and comprehensive eye health in Natta-Mwanza, Tanzania.">
    <meta property="twitter:image" content="{{ asset('images/logo.png') }}">

    <!-- Canonical URL -->
    <link rel="canonical" href="https://bestvisioneyecare.com{{ request()->path() === '/' ? '' : '/' . request()->path() }}">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="apple-touch-icon" href="{{ asset('images/logo.png') }}">

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "Best Vision Eyecare",
      "description": "Your trusted partner for clear vision and comprehensive eye health in Natta-Mwanza, Tanzania",
      "url": "https://bestvisioneyecare.com",
      "logo": "https://bestvisioneyecare.com/images/logo.png",
      "image": "https://bestvisioneyecare.com/images/logo.png",
      "telephone": "+255678110376",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Natta-Mwanza",
        "addressRegion": "Mwanza",
        "addressCountry": "TZ"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-2.5164",
        "longitude": "32.9176"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "08:00",
        "closes": "17:00"
      },
      "priceRange": "$$",
      "medicalSpecialty": "Optometry",
      "serviceType": [
        "Comprehensive Eye Exam",
        "Contact Lens Fitting",
        "Pediatric Eye Care",
        "Dry Eye Treatment",
        "Emergency Eye Care",
        "Eyewear Consultation"
      ]
    }
    </script>

    <link href="{{ \Illuminate\Support\Facades\URL::to('/') . '/css/fonts.css' }}" rel="stylesheet">

    @env('local')
        @viteReactRefresh
    @endenv
    @vite(['resources/js/app.jsx'])

    <style>
               #root {
                   min-height: 100vh;
                   display: flex;
                   flex-direction: column;
                   align-items: center;
                   justify-content: center;
                   background: transparent;
                   font-family: 'Roboto', 'Open Sans', sans-serif;
               }
        .loading-container {
            text-align: center;
            color: #2196F3;
        }
        .loading-logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
            position: relative;
            animation: pulse 2s ease-in-out infinite;
        }
        .loading-logo::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border: 4px solid #2196F3;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        .loading-logo::after {
            content: '👁️';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
        }
        .loading-text {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2196F3;
        }
        .loading-subtext {
            font-size: 16px;
            color: #333333;
            opacity: 0.8;
        }
        .loading-dots {
            display: inline-block;
            animation: dots 1.5s steps(4, end) infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }
    </style>
</head>
<body>
<noscript>
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h1>JavaScript Required</h1>
        <p>You need to enable JavaScript to run this application.</p>
    </div>
</noscript>
<div id="root">
    <div class="loading-container">
        <div class="loading-logo"></div>
        <div class="loading-text">Loading New Kayoka<span class="loading-dots"></span></div>
        <div class="loading-subtext">Please wait while we prepare your experience</div>
    </div>
</div>
</body>
</html>
