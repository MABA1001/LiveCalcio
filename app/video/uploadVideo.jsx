import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import Header from '../../Components/Header';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

const UploadScreen = () => {
  // here we gonna use useffect so that we can do screen rotation and other side effects
  const [videoURI, setVideoURI] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const videoRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (videoURI) {
      lockOrientation();
    }
  }, [videoURI]);

  const pickVideo = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this app to access your videos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const video = result.assets[0];
      setVideoURI(video.uri);
      const aspectRatio = video.width / video.height;
      setAspectRatio(aspectRatio);
      console.log(video.uri);
    }
  };

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
    const o = await ScreenOrientation.getOrientationAsync();
    setOrientation(o);
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  if (videoURI) {
    return (
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: videoURI }}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
          {!isLocked && (
            <View style={styles.overlay}>
              <Header />
              {/* Render player card and other UI elements as needed */}
            </View>
          )}
          <TouchableOpacity
            style={[styles.lockButton, { right: 10, top: 10 }]}
            onPress={toggleLock}
          >
            <Text style={styles.lockButtonText}>
              {isLocked ? 'Unlock' : 'Lock'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.Ucontainer}>
        <Header />
        <View style={styles.UcontentContainer}>
          <View style={styles.uploadTextContainer}>
            <Text style={styles.UuploadText}>Upload</Text>
            <Text style={styles.UuploadText}>Video</Text>
          </View>
          <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
            <Text style={styles.UbuttonText}>Browse</Text>
            <Text style={styles.UbuttonText}>Files</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

// here we have styles
const styles = StyleSheet.create({
  Ucontainer: {
    flex: 1,
    alignItems: 'center'
  },
  UcontentContainer: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    width: '100%' // Take full width
  },
  uploadButton: {
    borderWidth: 2,
    backgroundColor: '#cc0000',
    width: 150,
    height: 100,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  UbuttonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold'
  },
  UuploadText: {
    fontSize: 38,
    color: '#cc0000',
    fontWeight: 'bold'
  },

  uploadTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30 // Add margin for better spacing
  },
  /////// video display from here styles
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  uploadButton: {
    borderWidth: 2,
    backgroundColor: '#cc0000',
    width: 150,
    height: 100,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold'
  },
  uploadText: {
    fontSize: 38,
    color: '#cc0000',
    fontWeight: 'bold'
  },
  uploadTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  video: {
    width: '100%',
    height: '100%'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start'
  },
  lockButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lockButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  // Add other specific styles from the display video screen as necessary
  // For example, styles for the PlayerCard, if you're keeping that component
  PlayerCardStyles: {
    width: 300,
    height: 270,
    margin: 10,
    marginLeft: 40,
    borderRadius: 10
  }
});

export default UploadScreen;
