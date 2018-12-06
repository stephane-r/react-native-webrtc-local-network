import React from 'react';
import { StyleSheet, View, Button, Dimensions, Text } from 'react-native';
import { autobind } from 'core-decorators';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  MediaStreamTrack,
  getUserMedia
} from 'react-native-webrtc';
import ConnectionState from '../../components/ConnectionState';
import WebRTCView from '../../components/WebRTCView';
import Status from '../../components/Status';

const initialState = {
  peerCreated: false,
  offerCreated: false,
  offerImported: false,
  answerCreated: false,
  answerImported: false,
  connectionState: null,
  initiator: false,
  videoURL: null,
  offer: null,
  error: []
};

const configuration = { iceServers: [{ urls: [] }] };

class InitiatorScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.pc = new RTCPeerConnection(configuration);
  }

  state = initialState;

  componentDidMount() {
    const { pc } = this;

    if (pc) {
      this.setState({
        peerCreated: true
      });
    }

    this.setConnectionState();

    pc.oniceconnectionstatechange = () => this.setConnectionState();

    pc.onaddstream = ({ stream }) => {
      if (stream) {
        this.setState({
          receiverVideoURL: stream.toURL()
        });
      }
    };

    pc.onnegotiationneeded = () => {
      if (this.state.initiator) {
        this.createOffer();
      }
    };

    pc.onicecandidate = ({ candidate }) => {
      if (candidate === null) {
        setTimeout(() => {
          this.setState({
            offer: JSON.stringify(pc.localDescription)
          });
        }, 2000);
      }
    };
  }

  @autobind
  setConnectionState() {
    this.setState({
      connectionState: this.pc.iceConnectionState
    });
  }

  getUserMedia() {
    MediaStreamTrack.getSources(() => {
      getUserMedia(
        {
          audio: false,
          video: true
        },
        this.getUserMediaSuccess,
        this.getUserMediaError
      );
    });
  }

  @autobind
  async getUserMediaSuccess(stream) {
    const { pc } = this;

    pc.addStream(stream);

    await this.setState({ videoURL: stream.toURL() });

    if (this.state.initiator) {
      return this.createOffer();
    }

    return this.createAnswer();
  }

  getUserMediaError(error) {
    console.log(error);
  }

  @autobind
  logError(error) {
    const errorArray = [...this.state.error, error];
    return this.setState({
      error: errorArray
    });
  }

  /**
   * Create anwser
   *
   * @memberof InitiatorScreen
   */
  @autobind
  async createAnswer() {
    const { pc } = this;
    const { offer } = this.state;

    if (offer) {
      const sd = new RTCSessionDescription(JSON.parse(offer));

      await this.setState({
        offerImported: true
      });

      pc.setRemoteDescription(sd)
        .then(() => pc.createAnswer())
        .then(answer => pc.setLocalDescription(answer))
        .then(() => {
          this.setState({
            answerCreated: true
          });
        })
        .catch(this.logError);
    }
  }

  @autobind
  receiveAnswer() {
    const { pc } = this;
    const { data } = this.state;
    const sd = new RTCSessionDescription(JSON.parse(data));

    return pc
      .setRemoteDescription(sd)
      .then(() => {
        this.setState({
          answerImported: true
        });
      })
      .catch(this.logError);
  }

  /**
   * Start communication
   *
   * @param {boolean} [initiator=true]
   * @returns
   * @memberof InitiatorScreen
   */
  @autobind
  async start(initiator = this.state.initiator) {
    if (initiator) {
      await this.setState({
        initiator: true
      });
    }

    return this.getUserMedia();
  }

  render() {
    const {
      offer,
      initiator,
      videoURL,
      receiverVideoURL,
      connectionState,
      error,
      peerCreated,
      offerCreated,
      offerImported,
      answerCreated,
      answerImported
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <ConnectionState text={connectionState} />
          <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
            <Status text="Initiator" isTrue={initiator} />
            <Status text="Peer created" isTrue={peerCreated} />
            <Status text="Offer created" isTrue={offerCreated} />
            <Status text="Offer imported" isTrue={offerImported} />
            <Status text="Answer created" isTrue={answerCreated} />
            <Status text="Answer imported" isTrue={answerImported} />
          </View>
        </View>
        {error.length > 0 && (
          <View>
            {error.map((e, index) => (
              <Text key={index}>{e}</Text>
            ))}
          </View>
        )}
        <View style={styles.container}>
          <WebRTCView
            title="Create Answer"
            onPress={() => this.start()}
            disabled={offer === null}
            placeholder="Paste initiator offer"
            onChangeText={value => this.setState({ offer: value })}
            value={offer}
            streamURL={receiverVideoURL}
          />
        </View>
      </View>
    );
  }
}

const isMediumSize = Dimensions.get('window').width > 640;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: isMediumSize ? 'row' : 'column'
  },
  header: {
    width: '100%'
  }
});

export default InitiatorScreen;
