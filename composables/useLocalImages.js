export const useLocalImages = () => {
  const images = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // PNW Landmarks and Locations with real image sources
  const pnwLandmarks = [
    // Washington State Landmarks
    {
      location: "Mount Rainier National Park, WA",
      description: "The iconic 14,411-foot stratovolcano and highest peak in Washington",
      searchTerms: ["Mount Rainier", "Washington", "national park"],
      coordinates: { lat: 46.8523, lng: -121.7603 },
      region: "Washington"
    },
    {
      location: "Pike Place Market, Seattle, WA",
      description: "Historic public market overlooking Elliott Bay, famous for fish throwing",
      searchTerms: ["Pike Place Market", "Seattle", "Washington"],
      coordinates: { lat: 47.6097, lng: -122.3421 },
      region: "Washington"
    },
    {
      location: "Space Needle, Seattle, WA",
      description: "Iconic 605-foot observation tower and symbol of Seattle",
      searchTerms: ["Space Needle", "Seattle", "Washington"],
      coordinates: { lat: 47.6205, lng: -122.3493 },
      region: "Washington"
    },
    {
      location: "Olympic National Park, WA",
      description: "UNESCO World Heritage site with rainforests, mountains, and coastline",
      searchTerms: ["Olympic National Park", "Washington", "rainforest"],
      coordinates: { lat: 47.8021, lng: -123.6044 },
      region: "Washington"
    },
    {
      location: "Spokane Falls, WA",
      description: "Powerful waterfalls in the heart of downtown Spokane",
      searchTerms: ["Spokane Falls", "Washington", "waterfall"],
      coordinates: { lat: 47.6588, lng: -117.4260 },
      region: "Washington"
    },
    {
      location: "Palouse Falls, WA",
      description: "198-foot waterfall in the scenic Palouse region",
      searchTerms: ["Palouse Falls", "Washington", "waterfall"],
      coordinates: { lat: 46.6631, lng: -118.2232 },
      region: "Washington"
    },
    {
      location: "Snoqualmie Falls, WA",
      description: "268-foot waterfall near Seattle, popular tourist destination",
      searchTerms: ["Snoqualmie Falls", "Washington", "waterfall"],
      coordinates: { lat: 47.5448, lng: -121.8387 },
      region: "Washington"
    },
    {
      location: "Deception Pass Bridge, WA",
      description: "Historic bridge connecting Whidbey Island to Fidalgo Island",
      searchTerms: ["Deception Pass Bridge", "Washington", "bridge"],
      coordinates: { lat: 48.4121, lng: -122.6449 },
      region: "Washington"
    },
    {
      location: "Hoh Rain Forest, WA",
      description: "One of the largest temperate rainforests in the US",
      searchTerms: ["Hoh Rain Forest", "Olympic National Park", "Washington"],
      coordinates: { lat: 47.7499, lng: -124.1001 },
      region: "Washington"
    },
    {
      location: "Lake Chelan, WA",
      description: "50-mile long lake in the Cascade Mountains",
      searchTerms: ["Lake Chelan", "Washington", "lake"],
      coordinates: { lat: 47.8476, lng: -120.3226 },
      region: "Washington"
    },

    // Oregon Landmarks
    {
      location: "Crater Lake National Park, OR",
      description: "Deep blue lake formed in a volcanic crater, deepest in the US",
      searchTerms: ["Crater Lake", "Oregon", "national park"],
      coordinates: { lat: 42.9445, lng: -122.1090 },
      region: "Oregon"
    },
    {
      location: "Multnomah Falls, OR",
      description: "620-foot waterfall in the Columbia River Gorge",
      searchTerms: ["Multnomah Falls", "Oregon", "waterfall"],
      coordinates: { lat: 45.5762, lng: -122.1154 },
      region: "Oregon"
    },
    {
      location: "Cannon Beach, OR",
      description: "Famous beach with Haystack Rock and dramatic coastline",
      searchTerms: ["Cannon Beach", "Haystack Rock", "Oregon"],
      coordinates: { lat: 45.8918, lng: -123.9615 },
      region: "Oregon"
    },
    {
      location: "Mount Hood, OR",
      description: "11,249-foot stratovolcano and Oregon's highest peak",
      searchTerms: ["Mount Hood", "Oregon", "mountain"],
      coordinates: { lat: 45.3735, lng: -121.6959 },
      region: "Oregon"
    },
    {
      location: "Columbia River Gorge, OR",
      description: "Spectacular canyon with waterfalls and scenic viewpoints",
      searchTerms: ["Columbia River Gorge", "Oregon", "waterfalls"],
      coordinates: { lat: 45.7153, lng: -121.5045 },
      region: "Oregon"
    },
    {
      location: "Portland Japanese Garden, OR",
      description: "Considered the most authentic Japanese garden outside Japan",
      searchTerms: ["Portland Japanese Garden", "Oregon", "garden"],
      coordinates: { lat: 45.5191, lng: -122.7084 },
      region: "Oregon"
    },
    {
      location: "Smith Rock State Park, OR",
      description: "Dramatic rock formations and world-class rock climbing",
      searchTerms: ["Smith Rock", "Oregon", "rock climbing"],
      coordinates: { lat: 44.3668, lng: -121.1378 },
      region: "Oregon"
    },
    {
      location: "Painted Hills, OR",
      description: "Colorful layered hills in the John Day Fossil Beds",
      searchTerms: ["Painted Hills", "Oregon", "John Day"],
      coordinates: { lat: 44.6626, lng: -120.2686 },
      region: "Oregon"
    },

    // Idaho Landmarks
    {
      location: "Sawtooth Mountains, ID",
      description: "Rugged mountain range with alpine lakes and hiking trails",
      searchTerms: ["Sawtooth Mountains", "Idaho", "mountains"],
      coordinates: { lat: 43.9067, lng: -114.7089 },
      region: "Idaho"
    },
    {
      location: "Shoshone Falls, ID",
      description: "212-foot waterfall higher than Niagara Falls",
      searchTerms: ["Shoshone Falls", "Idaho", "waterfall"],
      coordinates: { lat: 42.5964, lng: -114.4003 },
      region: "Idaho"
    },
    {
      location: "Coeur d'Alene Lake, ID",
      description: "Beautiful lake surrounded by mountains and forests",
      searchTerms: ["Coeur d'Alene Lake", "Idaho", "lake"],
      coordinates: { lat: 47.6166, lng: -116.7996 },
      region: "Idaho"
    },
    {
      location: "Craters of the Moon, ID",
      description: "Lunar-like landscape with volcanic formations",
      searchTerms: ["Craters of the Moon", "Idaho", "volcanic"],
      coordinates: { lat: 43.4204, lng: -113.5167 },
      region: "Idaho"
    },
    {
      location: "Boise River Greenbelt, ID",
      description: "25-mile urban pathway along the Boise River",
      searchTerms: ["Boise River Greenbelt", "Idaho", "trail"],
      coordinates: { lat: 43.6150, lng: -116.2023 },
      region: "Idaho"
    },

    // Montana Landmarks
    {
      location: "Glacier National Park, MT",
      description: "Crown of the Continent with glaciers and pristine wilderness",
      searchTerms: ["Glacier National Park", "Montana", "Going-to-the-Sun Road"],
      coordinates: { lat: 48.7596, lng: -113.7870 },
      region: "Montana"
    },
    {
      location: "Yellowstone National Park, MT",
      description: "First national park with geysers and wildlife",
      searchTerms: ["Yellowstone National Park", "Montana", "geysers"],
      coordinates: { lat: 44.4280, lng: -110.5885 },
      region: "Montana"
    },
    {
      location: "Flathead Lake, MT",
      description: "Largest natural freshwater lake west of the Mississippi",
      searchTerms: ["Flathead Lake", "Montana", "lake"],
      coordinates: { lat: 47.8989, lng: -114.2254 },
      region: "Montana"
    },
    {
      location: "Bozeman, MT",
      description: "Historic downtown with mountain views and outdoor culture",
      searchTerms: ["Bozeman Montana", "downtown", "mountains"],
      coordinates: { lat: 45.6769, lng: -111.0429 },
      region: "Montana"
    },
    {
      location: "Missoula, MT",
      description: "University town surrounded by mountains and rivers",
      searchTerms: ["Missoula Montana", "university", "mountains"],
      coordinates: { lat: 46.8721, lng: -113.9940 },
      region: "Montana"
    }
  ];

  // Test if an image URL is accessible
  const testImageUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Fetch images from Unsplash API
  const fetchUnsplashImage = async (searchTerm) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm + " Pacific Northwest")}&orientation=landscape&per_page=1`,
        {
          headers: {
            'Authorization': 'Client-ID YOUR_UNSPLASH_ACCESS_KEY' // You'll need to add this to your environment variables
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Unsplash API error');
      }
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return {
          url: data.results[0].urls.regular,
          photographer: data.results[0].user.name,
          photographerUrl: data.results[0].user.links.html
        };
      }
    } catch (error) {
      console.error('Error fetching from Unsplash:', error);
    }
    return null;
  };

  // Fetch images from Flickr API
  const fetchFlickrImage = async (searchTerm) => {
    try {
      const response = await fetch(
        `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=YOUR_FLICKR_API_KEY&text=${encodeURIComponent(searchTerm + " Pacific Northwest")}&format=json&nojsoncallback=1&per_page=1&sort=relevance&content_type=1&media=photos&extras=url_l,owner_name`
      );
      
      if (!response.ok) {
        throw new Error('Flickr API error');
      }
      
      const data = await response.json();
      if (data.photos && data.photos.photo && data.photos.photo.length > 0) {
        const photo = data.photos.photo[0];
        return {
          url: photo.url_l,
          photographer: photo.ownername,
          photographerUrl: `https://www.flickr.com/photos/${photo.owner}`
        };
      }
    } catch (error) {
      console.error('Error fetching from Flickr:', error);
    }
    return null;
  };

  // Fallback to high-quality curated images
  const getFallbackImage = (landmark) => {
    const fallbackImages = {
      "Mount Rainier": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "Pike Place Market": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "Space Needle": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "Crater Lake": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "Glacier National Park": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      "Sawtooth Mountains": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    };

    // Find the best matching fallback
    for (const [key, url] of Object.entries(fallbackImages)) {
      if (landmark.location.includes(key)) {
        return url;
      }
    }

    // Default fallback
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
  };

  const fetchLocationImages = async () => {
    loading.value = true;
    error.value = null;

    try {
      const imagePromises = pnwLandmarks.map(async (landmark) => {
        // Try to get image from APIs first
        let imageData = null;
        
        // Try Unsplash first
        for (const searchTerm of landmark.searchTerms) {
          imageData = await fetchUnsplashImage(searchTerm);
          if (imageData) break;
        }
        
        // If no Unsplash image, try Flickr
        if (!imageData) {
          for (const searchTerm of landmark.searchTerms) {
            imageData = await fetchFlickrImage(searchTerm);
            if (imageData) break;
          }
        }

        // Use fallback if no API images available
        if (!imageData) {
          return {
            url: getFallbackImage(landmark),
            location: landmark.location,
            description: landmark.description,
            source: "Unsplash Community",
            photographer: "Community Contributor",
            isLocal: false,
            region: landmark.region
          };
        }

        return {
          url: imageData.url,
          location: landmark.location,
          description: landmark.description,
          source: "Professional Photography",
          photographer: imageData.photographer,
          photographerUrl: imageData.photographerUrl,
          isLocal: true,
          region: landmark.region
        };
      });

      images.value = await Promise.all(imagePromises);
      
      // Shuffle the images for variety
      images.value = images.value.sort(() => Math.random() - 0.5);
      
    } catch (err) {
      console.error("Error fetching images:", err);
      error.value = "Failed to load local images";
      
      // Complete fallback to curated images
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
