const STORAGE_KEY = "foodDeliveryProFavouriteVideos";

const readVideos = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeVideos = (videos) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(videos)
    );

    window.dispatchEvent(
      new CustomEvent("favourite-videos-updated")
    );
  } catch {
    // Ignore storage errors safely.
  }
};

export const getFavouriteVideos = () => {
  return readVideos();
};

export const isFavouriteVideo = (videoId) => {
  if (!videoId) return false;

  return readVideos().some(
    (video) => String(video.id) === String(videoId)
  );
};

export const toggleFavouriteVideo = (video) => {
  if (!video?.id) {
    return false;
  }

  const videos = readVideos();

  const existingIndex = videos.findIndex(
    (item) =>
      String(item.id) === String(video.id)
  );

  if (existingIndex >= 0) {
    videos.splice(existingIndex, 1);
    writeVideos(videos);

    return false;
  }

  videos.unshift({
    id: video.id,

    restaurantId:
      video.restaurant?.id ||
      video.restaurantId ||
      null,

    restaurantName:
      video.restaurant?.name ||
      video.restaurantName ||
      "Restaurant",

    restaurant:
      video.restaurant || null,

    food:
      video.food || null,

    videoUrl:
      video.videoUrl || "",

    name:
      video.name ||
      video.restaurant?.name ||
      "Food Video",

    image:
      video.image ||
      video.restaurant?.image ||
      video.food?.image ||
      "",

    description:
      video.description ||
      video.restaurant?.description ||
      "",

    rating:
      video.rating ||
      video.restaurant?.rating ||
      "4.5",

    address:
      video.address ||
      video.restaurant?.address ||
      "",

    tags:
      video.tags ||
      [],

    savedAt: Date.now(),
  });

  writeVideos(videos);

  return true;
};

export const removeFavouriteVideo = (videoId) => {
  if (!videoId) return;

  const videos = readVideos().filter(
    (video) =>
      String(video.id) !== String(videoId)
  );

  writeVideos(videos);
};

export default {
  getFavouriteVideos,
  isFavouriteVideo,
  toggleFavouriteVideo,
  removeFavouriteVideo,
};
