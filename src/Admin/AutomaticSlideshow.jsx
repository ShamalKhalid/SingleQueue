import React, { useState, useEffect } from 'react';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../firebase';

const AutomaticSlideshow = ({ refresh, setRefresh }) => {
  const [mediaList, setMediaList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleComplete, setCycleComplete] = useState(false);
  const imageListRef = ref(storage, 'images/');
  const videoListRef = ref(storage, 'videos/');
  const [currentVideoDuration, setCurrentVideoDuration] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      console.log("Fetching media...");
      try {
        const imageResponse = await listAll(imageListRef);
        const videoResponse = await listAll(videoListRef);

        const imageUrls = await Promise.all(imageResponse.items.map(item => getDownloadURL(item)));
        const videoUrls = await Promise.all(videoResponse.items.map(item => getDownloadURL(item)));

        const images = imageUrls.map(url => ({ url, isVideo: false }));
        const videos = videoUrls.map(url => ({ url, isVideo: true }));

        setMediaList([...images, ...videos]);
        console.log("Media fetched:", [...images, ...videos]);
        setCurrentIndex(0); // Reset to first media after fetching new media
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, [refresh]);

  useEffect(() => {
    let interval;
    if (mediaList.length > 0) {
      const currentMedia = mediaList[currentIndex];
      if (currentMedia.isVideo) {
        interval = setTimeout(() => {
          setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % mediaList.length;
            if (newIndex === 0) {
              console.log("Cycle complete, triggering refresh");
              setCycleComplete(true);
            }
            return newIndex;
          });
        }, currentVideoDuration || 6000); // use video duration or default 6s
      } else {
        interval = setInterval(() => {
          setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % mediaList.length;
            if (newIndex === 0) {
              console.log("Cycle complete, triggering refresh");
              setCycleComplete(true);
            }
            return newIndex;
          });
        }, 6000); // default 6s for images
      }
    }

    return () => clearInterval(interval);
  }, [mediaList, currentIndex, currentVideoDuration]);

  useEffect(() => {
    if (cycleComplete) {
      setCycleComplete(false);
      console.log("Toggling refresh");
      setRefresh(prev => !prev);
    }
  }, [cycleComplete, setRefresh]);

  const handleVideoDurationChange = (event) => {
    setCurrentVideoDuration(event.target.duration * 1000); // convert to milliseconds
  };

  const handleVideoEnded = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % mediaList.length;
      if (newIndex === 0) {
        console.log("Cycle complete, triggering refresh");
        setCycleComplete(true);
      }
      return newIndex;
    });
  };

  return (
    <div className="relative border rounded-lg shadow-lg overflow-hidden w-full h-[600px]">
      {mediaList.length > 0 ? (
        mediaList[currentIndex].isVideo ? (
          <video
            src={mediaList[currentIndex].url}
            autoPlay
            onLoadedMetadata={handleVideoDurationChange}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={mediaList[currentIndex].url}
            alt="Automatic Slideshow"
            className="w-full h-full object-cover"
          />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AutomaticSlideshow;