import React, {useContext, useState} from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppContext} from '../Context';
import {AppImages} from '../Theme/AppImages';
import {width} from '../Utils/Constant';

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
  },
  sideBar: {
    width: 100,
    position: 'absolute',
    zIndex: 1000,
    right: 10,
    alignItems: 'center'
  },
  iconOuter: {
    marginVertical: 8,
  },
  center: {
    alignItems: 'center',
  },
  imageOuter: {
    width,
    justifyContent: 'center',
  },
});

const RenderIcon = ({obj, onPress, exStyle = {}}) => {
  const {appTheme} = useContext(AppContext);
  const {iconOuter, center, icon, text} = styles;
  const {type, imageIcon, size = 30, disText} = obj;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(type)}
      style={iconOuter}>
      <View styles={center}>
        <Image
          source={imageIcon}
          style={[
            icon,
            {
              height: size,
              width: size,
              tintColor: appTheme.tint,
            },
            exStyle,
          ]}
          resizeMode={'contain'}
        />
        {(disText && (
          <Text style={[text, {color: appTheme.tint}]}>{`${disText}`}</Text>
        )) ||
          null}
      </View>
    </TouchableOpacity>
  );
};

const FeedSideBar = ({item, animation}) => {
  const {appTheme} = useContext(AppContext);
  const insets = useSafeAreaInsets();
  const {sideBar} = styles;
  const {comments} = item;

  const [likeStatus, setLikeStatus] = useState(item.likeStatus);
  const [likes, setLikes] = useState(item.likes);

  const parseLikes = (likes) => {
    if (typeof likes === 'number') return likes; // Already a number
    if (likes.includes('K')) return parseFloat(likes) * 1000; // Convert "4.5K" -> 4500
    return parseInt(likes, 10); // Convert normal string numbers -> int
  };
  
  const formatLikes = (count) => {
    return count >= 1000 ? (count / 1000).toFixed(1) + 'K' : count.toString();
  };
  
  const makeAction = async (type) => {
    if (type === 'Like') {
      setLikeStatus((prev) => {
        const newStatus = !prev;
        setLikes((prevLikes) => {
          let numericLikes = parseLikes(prevLikes);
          numericLikes = newStatus ? numericLikes + 1 : numericLikes - 1;
          return formatLikes(numericLikes);
        });
        return newStatus;
      });
    }
  };

  return (
    <Animated.View
      style={[
        sideBar,
        {
          bottom: insets.bottom + 10,
          flexDirection:'row'
        },
        animation,
      ]}>
      <RenderIcon
        obj={{
          imageIcon: AppImages.heart,
          disText: likes,
          size: 35,
          type: 'Like',
        }}
        exStyle={{tintColor: (likeStatus && appTheme.red) || appTheme.tint}}
        onPress={() =>  makeAction('Like')}
      />
      <RenderIcon
        obj={{
          imageIcon: AppImages.comment, 
          disText: comments, 
          type: 'Comment'
        }}
        onPress={() =>  {}}
      />
    </Animated.View>
  );
};

export {FeedSideBar};
