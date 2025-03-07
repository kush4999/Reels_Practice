import React, { useContext, useState } from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppContext } from "../Context";
import CommonStyle from "../Theme/CommonStyle";
import { width } from "../Utils/Constant";
import { Colors } from "../Theme/Colors";
import { AppImages } from "../Theme/AppImages";

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 10,
    position: "absolute",
    zIndex: 1000,
    bottom: 0,
    left: 0,
    width: width - 100,
  },
  header: {
    paddingHorizontal: 20,
    position: "absolute",
    zIndex: 1000,
    top: 20,
    left: 0,
    width: width,
  },
  text: {
    fontSize: 15,
    textAlign: "center",
  },
  userName: {
    fontSize: 16,
    marginHorizontal: 8,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  userDetail: {
    marginBottom: 5,
  },
  postDetail: {
    flexDirection: "row",
    marginLeft: 8,
  },
  avatar: {
    height: 34,
    width: 34,
    borderRadius: 17,
    marginRight: 5,
  },
  readMore: {
    color: Colors.white,
    fontWeight: "bold",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  touchArea: {
    padding: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  mute: {
    height: 24,
    width: 24,
  },
});

const FeedFooter = ({ item, animation }) => {
  const { appTheme } = useContext(AppContext);
  const insets = useSafeAreaInsets();
  const { row, avatar, userName, postDetail, readMore } = styles;
  const {
    user: { username, profilePic },
    description,
  } = item;

  const [expanded, setExpanded] = useState(false);
  const maxLines = 1;

  const { isMute, setIsMute } = useContext(AppContext);
  const [viewAnim] = useState(new Animated.Value(0));

  const onVolumePress = () => {
    setIsMute();
    Animated.timing(viewAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      fadeOut();
    });
  };

  const fadeOut = () => {
    Animated.timing(viewAnim, {
      delay: 500,
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Animated.View
        style={[
          styles.header,
          {
            marginBottom: insets.bottom + 20,
            width: "100%",
            flexDirection: "row",
            top: Platform.OS == 'android' ? 20 : 60,
          },
          animation,
        ]}
      >
        <View style={[row, { width: "60%" }]}>
          <Image
            source={profilePic}
            style={[
              avatar,
              {
                backgroundColor: appTheme.border,
              },
            ]}
          />
          <Text numberOfLines={1} style={[userName, { color: appTheme.tint }]}>
            {username}
          </Text>
        </View>
        <View style={[row, { width: "40%", justifyContent: "flex-end" }]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={onVolumePress}
            style={styles.touchArea}
          >
            <Image
              source={(isMute && AppImages.mute) || AppImages.volume}
              style={styles.mute}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.footer,
          {
            marginBottom: insets.bottom + 20,
          },
          animation,
        ]}
      >
        <View style={postDetail}>
          <Text
            style={[CommonStyle.flexContainer, { color: appTheme.tint }]}
            numberOfLines={expanded ? undefined : maxLines}
          >
            {description}
          </Text>
          {description.length > 50 && !expanded && (
            <TouchableOpacity onPress={() => setExpanded(true)}>
              <Text style={readMore}>Read more</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </>
  );
};

export { FeedFooter };