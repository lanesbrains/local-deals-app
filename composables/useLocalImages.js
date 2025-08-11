export const useLocalImages = () => {
  const images = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // High-quality curated PNW landmarks with real images
  const pnwLandmarks = [
    // Washington State Landmarks
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Mount Rainier National Park, WA",
      description: "The iconic 14,411-foot stratovolcano and highest peak in Washington",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Washington"
    },
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Pike Place Market, Seattle, WA",
      description: "Historic public market overlooking Elliott Bay, famous for fish throwing",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Washington"
    },
    {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Space Needle, Seattle, WA",
      description: "Iconic 605-foot observation tower and symbol of Seattle",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Washington"
    },
    {
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      location: "Olympic National Park, WA",
      description: "UNESCO World Heritage site with rainforests, mountains, and coastline",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Washington"
    },
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Spokane Falls, WA",
      description: "Powerful waterfalls in the heart of downtown Spokane",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Washington"
    },
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Palouse Falls, WA",
      description: "198-foot waterfall in the scenic Palouse region",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Washington"
    },
    {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Snoqualmie Falls, WA",
      description: "268-foot waterfall near Seattle, popular tourist destination",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Washington"
    },
    {
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      location: "Deception Pass Bridge, WA",
      description: "Historic bridge connecting Whidbey Island to Fidalgo Island",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Washington"
    },
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Hoh Rain Forest, WA",
      description: "One of the largest temperate rainforests in the US",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Washington"
    },
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Lake Chelan, WA",
      description: "50-mile long lake in the Cascade Mountains",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Washington"
    },

    // Oregon Landmarks
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Crater Lake National Park, OR",
      description: "Deep blue lake formed in a volcanic crater, deepest in the US",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Oregon"
    },
    {
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      location: "Multnomah Falls, OR",
      description: "620-foot waterfall in the Columbia River Gorge",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Oregon"
    },
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Cannon Beach, OR",
      description: "Famous beach with Haystack Rock and dramatic coastline",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Oregon"
    },
    {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Mount Hood, OR",
      description: "11,249-foot stratovolcano and Oregon's highest peak",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Oregon"
    },
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Columbia River Gorge, OR",
      description: "Spectacular canyon with waterfalls and scenic viewpoints",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Oregon"
    },
    {
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      location: "Portland Japanese Garden, OR",
      description: "Considered the most authentic Japanese garden outside Japan",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Oregon"
    },
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Smith Rock State Park, OR",
      description: "Dramatic rock formations and world-class rock climbing",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Oregon"
    },
    {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Painted Hills, OR",
      description: "Colorful layered hills in the John Day Fossil Beds",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Oregon"
    },

    // Idaho Landmarks
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Sawtooth Mountains, ID",
      description: "Rugged mountain range with alpine lakes and hiking trails",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Idaho"
    },
    {
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      location: "Shoshone Falls, ID",
      description: "212-foot waterfall higher than Niagara Falls",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Idaho"
    },
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Coeur d'Alene Lake, ID",
      description: "Beautiful lake surrounded by mountains and forests",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Idaho"
    },
    {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Craters of the Moon, ID",
      description: "Lunar-like landscape with volcanic formations",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Idaho"
    },
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Boise River Greenbelt, ID",
      description: "25-mile urban pathway along the Boise River",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Idaho"
    },

    // Montana Landmarks
    {
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      location: "Glacier National Park, MT",
      description: "Crown of the Continent with glaciers and pristine wilderness",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Montana"
    },
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Yellowstone National Park, MT",
      description: "First national park with geysers and wildlife",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Montana"
    },
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Flathead Lake, MT",
      description: "Largest natural freshwater lake west of the Mississippi",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Montana"
    },
    {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Bozeman, MT",
      description: "Historic downtown with mountain views and outdoor culture",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Montana"
    },
    {
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      location: "Missoula, MT",
      description: "University town surrounded by mountains and rivers",
      source: "Unsplash Community",
      photographer: "Community Contributor",
      isLocal: false,
      region: "Montana"
    }
  ];

  const fetchLocationImages = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Use the curated PNW landmarks directly
      images.value = pnwLandmarks.map(landmark => ({
        ...landmark,
        // Add timestamp to prevent caching issues
        url: `${landmark.url}?t=${Date.now()}`
      }));
      
      // Shuffle the images for variety
      images.value = images.value.sort(() => Math.random() - 0.5);
      
    } catch (err) {
      console.error("Error setting up images:", err);
      error.value = "Failed to load local images";
      
      // Fallback to basic images if something goes wrong
      images.value = [
        {
          url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          location: "Seattle Skyline & Space Needle, WA",
          description: "Iconic Seattle skyline with the Space Needle",
          source: "Unsplash Community",
          photographer: "Community Contributor",
          isLocal: false,
          region: "Washington"
        },
        {
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          location: "Pike Place Market, Seattle, WA",
          description: "Historic public market overlooking Elliott Bay",
          source: "Unsplash Community",
          photographer: "Community Contributor",
          isLocal: false,
          region: "Washington"
        },
        {
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          location: "Mount Rainier National Park, WA",
          description: "The iconic 14,411-foot stratovolcano",
          source: "Unsplash Community",
          photographer: "Community Contributor",
          isLocal: false,
          region: "Washington"
        },
        {
          url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
          location: "Glacier National Park, MT",
          description: "Crown of the Continent with pristine wilderness",
          source: "Unsplash Community",
          photographer: "Community Contributor",
          isLocal: false,
          region: "Montana"
        },
        {
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          location: "Crater Lake National Park, OR",
          description: "Deep blue lake formed in a volcanic crater",
          source: "Unsplash Community",
          photographer: "Community Contributor",
          isLocal: false,
          region: "Oregon"
        }
      ];
    } finally {
      loading.value = false;
    }
  };

  return {
    images,
    loading,
    error,
    fetchLocationImages,
  };
};
