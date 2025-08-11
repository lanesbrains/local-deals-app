
export const useLocalImages = () => {
  const images = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Use your existing local images from public folder
  const pnwLandmarks = [
    {
      url: "/pnw-mountains.jpg",
      location: "Pacific Northwest Mountains",
      description: "Beautiful PNW mountain landscape",
      source: "Local",
      photographer: "PNW Deals",
      isLocal: true,
      region: "PNW"
    },
    {
      url: "/forest-texture.jpg", 
      location: "PNW Forest",
      description: "Dense Pacific Northwest forest",
      source: "Local",
      photographer: "PNW Deals",
      isLocal: true,
      region: "PNW"
    }
  ];

  const fetchLocationImages = async () => {
    loading.value = true;
    error.value = null;

    try {
      images.value = pnwLandmarks.map(landmark => ({
        ...landmark,
        url: `${landmark.url}?t=${Date.now()}`
      }));
      
      // Shuffle for variety
      images.value = images.value.sort(() => Math.random() - 0.5);
      
    } catch (err) {
      console.error("Error setting up images:", err);
      error.value = "Failed to load images";
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

