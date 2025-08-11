export const useUnsplashImages = () => {
  const images = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Specific search terms for our target locations
  const locationSearches = [
    // Washington
    {
      query: "seattle skyline space needle",
      location: "Seattle Skyline & Space Needle, WA",
    },
    {
      query: "pike place market seattle",
      location: "Pike Place Market, Seattle, WA",
    },
    {
      query: "university of washington campus",
      location: "University of Washington, Seattle, WA",
    },
    {
      query: "spokane falls washington downtown",
      location: "Spokane Falls & Downtown, WA",
    },

    // Montana
    {
      query: "bozeman montana main street bridger mountains",
      location: "Bozeman Main Street & Mountains, MT",
    },
    {
      query: "montana state university bozeman",
      location: "Montana State University, Bozeman, MT",
    },
    {
      query: "butte montana historic uptown",
      location: "Butte Historic District, MT",
    },
    {
      query: "university of montana missoula",
      location: "University of Montana, Missoula, MT",
    },

    // Idaho
    {
      query: "coeur d alene lake idaho resort",
      location: "Coeur d'Alene Lake & Resort, ID",
    },
    {
      query: "post falls idaho spokane river",
      location: "Post Falls & Spokane River, ID",
    },
    {
      query: "boise state university downtown idaho",
      location: "Boise State University & Downtown, ID",
    },
    {
      query: "university of idaho moscow campus",
      location: "University of Idaho, Moscow, ID",
    },
  ];

  const fetchLocationImages = async () => {
    loading.value = true;
    error.value = null;

    try {
      const imagePromises = locationSearches.map(async (search) => {
        // Using Unsplash Source API for direct image URLs
        const width = 2070;
        const height = 1380;
        const url = `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(search.query)}`;

        return {
          url,
          location: search.location,
          photographer: "Unsplash Community",
          photographer_url: "https://unsplash.com",
        };
      });

      images.value = await Promise.all(imagePromises);
    } catch (err) {
      error.value = "Failed to load location images";
      console.error("Error fetching images:", err);

      // Fallback to curated images if API fails
      images.value = [
        {
          url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          location: "Seattle Skyline & Space Needle, WA",
          photographer: "Casey Horner",
        },
        {
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          location: "Pike Place Market, Seattle, WA",
          photographer: "Thom Milkovic",
        },
        {
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          location: "Bozeman Main Street & Mountains, MT",
          photographer: "Jeremy Bishop",
        },
        {
          url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
          location: "Coeur d'Alene Lake & Resort, ID",
          photographer: "David Marcu",
        },
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
