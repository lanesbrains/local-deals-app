



export const useLocalImages = () => {
  const images = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // PNW landmarks organized by region
  const pnwLandmarks = {
    washington: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Mount Rainier National Park, WA",
        description: "The iconic 14,411-foot stratovolcano and highest peak in Washington",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Washington"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Pike Place Market, Seattle, WA",
        description: "Historic public market overlooking Elliott Bay, famous for fish throwing",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Washington"
      },
      {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Space Needle, Seattle, WA",
        description: "Iconic 605-foot observation tower and symbol of Seattle",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Washington"
      },
      {
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
        location: "Olympic National Park, WA",
        description: "UNESCO World Heritage site with rainforests, mountains, and coastline",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Washington"
      },
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Snoqualmie Falls, WA",
        description: "268-foot waterfall near Seattle, popular tourist destination",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Washington"
      }
    ],
    oregon: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Crater Lake National Park, OR",
        description: "Deep blue lake formed in a volcanic crater, deepest in the US",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Oregon"
      },
      {
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
        location: "Multnomah Falls, OR",
        description: "620-foot waterfall in the Columbia River Gorge",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Oregon"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Cannon Beach, OR",
        description: "Famous beach with Haystack Rock and dramatic coastline",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Oregon"
      },
      {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Mount Hood, OR",
        description: "11,249-foot stratovolcano and Oregon's highest peak",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Oregon"
      },
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Portland Japanese Garden, OR",
        description: "Considered the most authentic Japanese garden outside Japan",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Oregon"
      }
    ],
    idaho: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Sawtooth Mountains, ID",
        description: "Rugged mountain range with alpine lakes and hiking trails",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Idaho"
      },
      {
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
        location: "Shoshone Falls, ID",
        description: "212-foot waterfall higher than Niagara Falls",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Idaho"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Coeur d'Alene Lake, ID",
        description: "Beautiful lake surrounded by mountains and forests",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Idaho"
      },
      {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Boise River Greenbelt, ID",
        description: "25-mile urban pathway along the Boise River",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Idaho"
      }
    ],
    montana: [
      {
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
        location: "Glacier National Park, MT",
        description: "Crown of the Continent with glaciers and pristine wilderness",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Montana"
      },
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Yellowstone National Park, MT",
        description: "First national park with geysers and wildlife",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Montana"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Flathead Lake, MT",
        description: "Largest natural freshwater lake west of the Mississippi",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Montana"
      },
      {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "Bozeman, MT",
        description: "Historic downtown with mountain views and outdoor culture",
        source: "Unsplash",
        photographer: "Community Contributor",
        isLocal: false,
        region: "Montana"
      }
    ]
  };

  // Detect user's location and get relevant landmarks
  const detectUserLocation = async () => {
    try {
      // Use a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      // Map state to region
      const stateToRegion = {
        'WA': 'washington',
        'OR': 'oregon', 
        'ID': 'idaho',
        'MT': 'montana'
      };
      
      const region = stateToRegion[data.region_code] || 'washington'; // Default to WA
      return region;
    } catch (err) {
      console.log('Could not detect location, defaulting to Washington');
      return 'washington'; // Default fallback
    }
  };

  const fetchLocationImages = async () => {
    loading.value = true;
    error.value = null;

    try {
      const userRegion = await detectUserLocation();
      const regionLandmarks = pnwLandmarks[userRegion] || pnwLandmarks.washington;
      
      // Take top 10 landmarks from the region
      const selectedLandmarks = regionLandmarks.slice(0, 10);
      
      images.value = selectedLandmarks.map(landmark => ({
        ...landmark,
        url: `${landmark.url}?t=${Date.now()}`
      }));
      
      // Shuffle for variety
      images.value = images.value.sort(() => Math.random() - 0.5);
      
    } catch (err) {
      console.error("Error setting up images:", err);
      error.value = "Failed to load images";
      
      // Fallback to Washington landmarks
      const fallbackLandmarks = pnwLandmarks.washington.slice(0, 10);
      images.value = fallbackLandmarks.map(landmark => ({
        ...landmark,
        url: `${landmark.url}?t=${Date.now()}`
      }));
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



