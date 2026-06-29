<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Primary Meta Tags -->
    <title>Best Vision EyeCare - Your Vision, Our Mission | Eye Clinic in Tanzania</title>
    <meta name="title" content="Best Vision EyeCare - Your Vision, Our Mission | Eye Clinic in Mwanza, Tanzania">
    <meta name="description" content="Best Vision EyeCare - Your trusted partner for comprehensive eye health. Expert eye examinations, contact lenses, eyewear, and vision care services.">
    <meta name="keywords" content="eye clinic, optometrist, eye exam, contact lenses, eyewear, vision care, eye health, pediatric eye care, dry eye treatment, best vision eyecare, Mwanza Tanzania">
    <meta name="author" content="Best Vision EyeCare">
    <meta name="robots" content="index, follow">
    <meta name="language" content="English">
    <meta name="revisit-after" content="7 days">
    <meta name="geo.region" content="TZ-18">
    <meta name="geo.placename" content="Mwanza, Tanzania">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://bestvision-eyecare.co.tz/">
    <meta property="og:title" content="Best Vision EyeCare - Your Vision, Our Mission">
    <meta property="og:description" content="Your trusted partner for comprehensive eye health in Mwanza, Tanzania. Expert eye examinations, contact lenses, eyewear, and vision care.">
    <meta property="og:site_name" content="Best Vision EyeCare">
    <meta property="og:locale" content="en_US">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://bestvision-eyecare.co.tz/">
    <meta property="twitter:title" content="Best Vision EyeCare - Your Vision, Our Mission">
    <meta property="twitter:description" content="Your trusted partner for comprehensive eye health in Mwanza, Tanzania.">
    <!-- Canonical URL -->
    <link rel="canonical" href="https://bestvision-eyecare.co.tz{{ request()->path() === '/' ? '' : '/' . request()->path() }}">

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "Best Vision EyeCare",
      "description": "Your trusted partner for comprehensive eye health in Mwanza, Tanzania",
      "url": "https://bestvision-eyecare.co.tz",
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
        "Comprehensive Eye Examinations",
        "Contact Lens Fitting",
        "Eyewear & Spectacles",
        "Pediatric Eye Care",
        "Dry Eye Treatment",
        "Vision Therapy",
        "Cataract Screening",
        "Low Vision Aids"
      ]
    }
    </script>

    <link href="{{ \Illuminate\Support\Facades\URL::to('/') . '/css/fonts.css' }}" rel="stylesheet">
    <link href="{{ asset('assets/css/styles.css') }}" rel="stylesheet">

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
    </style>
</head>
<body>
<noscript>
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h1>JavaScript Required</h1>
        <p>You need to enable JavaScript to run this application.</p>
    </div>
</noscript>
<div id="root"></div>
</body>
</html>
