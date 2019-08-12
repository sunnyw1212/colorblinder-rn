import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { Audio } from "expo-av";

import { Header } from "../../components";
import { storeData, retrieveData } from "../../utilities";
import styles from "./styles.js";

export default class Home extends Component {
  state = {
    isSoundOn: true,
    bestPoints: 0
  };

  async componentWillMount() {
    const highScore = await retrieveData("highScore");
    this.setState({ bestPoints: highScore || 0 });
    this.backgroundMusic = new Audio.Sound();
    this.buttonFX = new Audio.Sound();
    try {
      await this.backgroundMusic.loadAsync(
        require("../../assets/music/Komiku_Mushrooms.mp3")
      );
      await this.buttonFX.loadAsync(require("../../assets/sfx/button.wav"));
      await this.backgroundMusic.setIsLoopingAsync(true);
      await this.backgroundMusic.playAsync();
    } catch (err) {
      console.log("err playing music", err);
    }
  }

  handlePlayPress = () => {
    this.buttonFX.replayAsync();
    this.backgroundMusic.stopAsync();
    this.props.navigation.navigate("Game");
  };
  handleToggleSoundPress = () => {
    this.setState({ isSoundOn: !this.state.isSoundOn }, () => {
      this.state.isSoundOn
        ? this.backgroundMusic.replayAsync()
        : this.backgroundMusic.stopAsync();
    });
  };
  render() {
    const toggleSoundImageSource = this.state.isSoundOn
      ? require("../../assets/icons/speaker-on.png")
      : require("../../assets/icons/speaker-off.png");
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={{ flex: 1 }} />
          <Header />
          <TouchableOpacity
            onPress={this.handlePlayPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 80
            }}
          >
            <Image
              source={require("../../assets/icons/play_arrow.png")}
              style={styles.playIcon}
            />
            <Text style={styles.play}> PLAY!</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20
            }}
          >
            <Image
              source={require("../../assets/icons/trophy.png")}
              style={styles.trophyIcon}
            />
            <Text style={styles.hiscore}>
              Hi-score: {this.state.bestPoints}
            </Text>
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={this.handleToggleSoundPress}>
              <Image source={toggleSoundImageSource} style={styles.soundIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
