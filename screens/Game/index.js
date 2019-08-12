import React, { Component, Fragment } from "react";
import {
  Animated,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image
} from "react-native";
import { Audio } from "expo-av";

import { Header } from "../../components";
import {
  generateRGB,
  mutateRGB,
  shakeAnimation,
  storeData,
  retrieveData
} from "../../utilities";
import styles from "./styles";

export default class Game extends Component {
  state = {
    points: 0,
    timeLeft: 15,
    rgb: generateRGB(),
    size: 2,
    diffTileIndex: null,
    diffTileColor: null,
    gameState: "INGAME", // INGAME || PAUSED || LOST
    shakeVal: new Animated.Value(0),
    bestPoints: 0,
    bestTime: 0
  };

  async componentWillMount() {
    const highScore = await retrieveData("highScore");
    const bestTime = await retrieveData("bestTime");
    this.setState({ bestPoints: highScore || 0, bestTime: bestTime || 0 });
    this.generateNewRound();
    this.interval = setInterval(async () => {
      if (this.state.gameState === "INGAME") {
        if (this.state.timeLeft > this.state.bestTime) {
          this.setState({ bestTime: this.state.timeLeft });
          storeData("bestTime", this.state.timeLeft);
        }
        if (this.state.timeLeft <= 0) {
          this.lostFX.replayAsync();
          this.backgroundMusic.stopAsync();
          if (this.state.points > this.state.bestPoints) {
            this.setState({ bestPoints: this.state.points });
            storeData("highScore", this.state.points);
          }
          this.setState({ gameState: "LOST" });
        } else {
          this.setState(state => ({ timeLeft: state.timeLeft - 1 }));
        }
      }
    }, 1000);

    this.backgroundMusic = new Audio.Sound();
    this.buttonFX = new Audio.Sound();
    this.tileTapCorrectFX = new Audio.Sound();
    this.tileTapWrongFX = new Audio.Sound();
    this.pauseInFX = new Audio.Sound();
    this.pauseOutFX = new Audio.Sound();
    this.lostFX = new Audio.Sound();
    try {
      await this.backgroundMusic.loadAsync(
        require("../../assets/music/Komiku_BattleOfPogs.mp3")
      );
      await this.buttonFX.loadAsync(require("../../assets/sfx/button.wav"));
      await this.tileTapCorrectFX.loadAsync(
        require("../../assets/sfx/tile_tap.wav")
      );
      await this.tileTapWrongFX.loadAsync(
        require("../../assets/sfx/tile_wrong.wav")
      );
      await this.pauseInFX.loadAsync(require("../../assets/sfx/pause_in.wav"));
      await this.pauseOutFX.loadAsync(
        require("../../assets/sfx/pause_out.wav")
      );
      await this.lostFX.loadAsync(require("../../assets/sfx/lose.wav"));
      await this.backgroundMusic.setIsLoopingAsync(true);
      await this.backgroundMusic.playAsync();
    } catch (err) {
      console.log("err playing music", err);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  generateSizeIndex = size => {
    return Math.floor(Math.random() * size);
  };
  generateNewRound = () => {
    const RGB = generateRGB();
    const mRGB = mutateRGB(RGB);
    const { points } = this.state;
    // min 2 max 5
    const size = Math.min(Math.max(Math.floor(Math.sqrt(points)), 2), 5);
    this.setState({
      size,
      diffTileIndex: [
        this.generateSizeIndex(size),
        this.generateSizeIndex(size)
      ],
      diffTileColor: `rgb(${mRGB.r}, ${mRGB.g}, ${mRGB.b})`,
      rgb: RGB
    });
  };
  handleTilePress = (rowIndex, columnIndex) => {
    const { diffTileIndex, points, timeLeft, shakeVal } = this.state;
    if (
      diffTileIndex &&
      rowIndex === diffTileIndex[0] &&
      columnIndex === diffTileIndex[1]
    ) {
      this.tileTapCorrectFX.replayAsync();
      this.setState({ points: points + 1, timeLeft: timeLeft + 2 });
      this.generateNewRound();
    } else {
      shakeAnimation(shakeVal);
      this.tileTapWrongFX.replayAsync();
      this.setState({ timeLeft: timeLeft - 2 });
    }
  };
  handlePlayPausePress = async () => {
    switch (this.state.gameState) {
      case "INGAME":
        this.backgroundMusic.stopAsync();
        this.pauseInFX.replayAsync();
        this.setState({ gameState: "PAUSED" });
        break;
      case "PAUSED":
        this.backgroundMusic.replayAsync();
        this.pauseOutFX.replayAsync();
        this.setState({ gameState: "INGAME" });
        break;
      case "LOST":
        this.backgroundMusic.replayAsync();
        await this.setState({ points: 0, timeLeft: 15, size: 2 });
        this.generateNewRound();
        this.setState({ gameState: "INGAME" });
        break;
      default:
        break;
    }
  };
  handleExitPress = () => {
    this.backgroundMusic.stopAsync();
    this.props.navigation.goBack();
  };
  render() {
    const {
      rgb,
      diffTileIndex,
      diffTileColor,
      size,
      points,
      timeLeft,
      gameState,
      shakeVal,
      bestPoints,
      bestTime
    } = this.state;
    const { width } = Dimensions.get("window");

    const bottomIcon =
      gameState === "INGAME"
        ? require("../../assets/icons/pause.png")
        : gameState === "PAUSED"
        ? require("../../assets/icons/play.png")
        : require("../../assets/icons/replay.png");

    return (
      <View style={styles.container}>
        <Header />

        <Animated.View
          style={{
            height: width * 0.875,
            width: width * 0.875,
            flexDirection: "row",
            transform: [
              {
                translateX: shakeVal
              }
            ]
          }}
        >
          {gameState === "INGAME" ? (
            Array(size)
              .fill()
              .map((curVal, columnIndex) => {
                return (
                  <View
                    style={{ flex: 1, flexDirection: "column" }}
                    key={columnIndex}
                  >
                    {Array(size)
                      .fill()
                      .map((curVal, rowIndex) => {
                        return (
                          <TouchableOpacity
                            key={`${rowIndex}.${columnIndex}`}
                            style={{
                              flex: 1,
                              backgroundColor:
                                diffTileIndex &&
                                rowIndex === diffTileIndex[0] &&
                                columnIndex === diffTileIndex[1]
                                  ? diffTileColor
                                  : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                              margin: 2
                            }}
                            onPress={() =>
                              this.handleTilePress(rowIndex, columnIndex)
                            }
                          />
                        );
                      })}
                  </View>
                );
              })
          ) : (
            <View style={styles.pausedContainer}>
              {gameState === "PAUSED" ? (
                <Fragment>
                  <Image
                    source={require("../../assets/icons/mug.png")}
                    style={styles.pausedIcon}
                  />
                  <Text style={styles.pausedText}> PAUSED</Text>
                </Fragment>
              ) : (
                <Fragment>
                  <Image
                    source={require("../../assets/icons/dead.png")}
                    style={styles.pausedIcon}
                  />
                  <Text style={styles.pausedText}>U DED</Text>
                </Fragment>
              )}
              <TouchableOpacity onPress={this.handleExitPress}>
                <Image
                  source={require("../../assets/icons/escape.png")}
                  style={styles.exitIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomSectionContainer}>
            <Text style={styles.counterCount}>{points}</Text>
            <Text style={styles.counterLabel}> points</Text>
            <View style={styles.bestContainer}>
              <Image
                source={require("../../assets/icons/trophy.png")}
                style={styles.bestIcon}
              />
              <Text style={styles.bestLabel}>{bestPoints}</Text>
            </View>
          </View>
          <View style={styles.bottomSectionContainer}>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={this.handlePlayPausePress}
            >
              <Image source={bottomIcon} style={styles.bottomIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSectionContainer}>
            <Text style={styles.counterCount}>{timeLeft}</Text>
            <Text style={styles.counterLabel}> seconds left</Text>
            <View style={styles.bestContainer}>
              <Image
                source={require("../../assets/icons/clock.png")}
                style={styles.bestIcon}
              />
              <Text style={styles.bestLabel}>{bestTime}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
