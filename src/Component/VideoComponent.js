import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, Image } from 'react-native';
import Video from 'react-native-video';
import { AppContext } from '../Context';
import CommonStyle from '../Theme/CommonStyle';
import { width } from '../Utils/Constant';
import { AppImages } from '../Theme/AppImages';

const styles = StyleSheet.create({
  videoView: {
    width,
    opacity: 1,
  },
  videoOuter: {
    width,
    ...CommonStyle.center,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const VideoComponent = ({ post, isVisible }) => {
  const { displayHeight } = useContext(AppContext);
  const videoRef = useRef(null);
  const { videoOuter, videoView, iconContainer } = styles;

  // State to manage play/pause
  const [paused, setPaused] = useState(!isVisible);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setPaused(!isVisible);
  }, [isVisible]);

  // Toggle play/pause on tap
  const handleVideoPress = () => {
    setPaused((prev) => !prev);
    showPlayPauseIcon();
  };

  // Auto-hide play button after 2 seconds
  const showPlayPauseIcon = () => {
    opacity.setValue(1); // Make it fully visible
    Animated.timing(opacity, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback onPress={handleVideoPress}>
      <View style={[videoOuter, {height: displayHeight}]}>
        <Video
          ref={videoRef}
          fullscreenAutorotate={true}
          source={{uri: post}}
          repeat={true}
          resizeMode="cover"
          style={[videoView, {height: displayHeight}]}
          playInBackground={false}
          paused={paused}
          ignoreSilentSwitch="ignore"
          onError={error => console.log('Video Error:', error)}
        />

        {/* Play/Pause Icon (Fades Out) */}
        <Animated.View style={[iconContainer, {opacity}]}>
          <Image
            source={paused ? AppImages.playIcon : AppImages.pauseIcon}
            style={{height: 60, width: 60}}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export { VideoComponent };
