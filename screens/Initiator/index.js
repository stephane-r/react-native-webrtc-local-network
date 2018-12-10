import React from 'react';
import { StyleSheet, View, Button, Dimensions, Text } from 'react-native';
import { autobind } from 'core-decorators';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  MediaStreamTrack,
  getUserMedia
} from 'react-native-webrtc';
import net from 'net';
import DeviceInfo from 'react-native-device-info';
import ConnectionState from '../../components/ConnectionState';
import WebRTCView from '../../components/WebRTCView';
import Status from '../../components/Status';

const SERVER_PORT = 60536;
// const SERVER_HOST = '192.168.10.78';
const SERVER_HOST = '192.168.43.174';
const clients = [];
let InitiatorComponent;

const server = net.createServer(socket => {
  socket.setEncoding('utf8');
  socket.name = socket.address().address;

  clients.push(socket);

  socket.on('data', data => {
    broadcast(data, socket);
  });

  socket.on('end', () => {
    clients.splice(clients.indexOf(socket), 1);
  });

  function broadcast(message, sender) {
    clients.forEach(client => {
      if (client === sender) return;
      client.write(message);
    });
  }
});

server.listen(SERVER_PORT, () => console.log('hello'));

const client = net.createConnection(SERVER_PORT, SERVER_HOST);

client.on('connect', () => {
  InitiatorComponent.setState({
    clientConnected: true
  });
});

client.on('data', data => {
  InitiatorComponent.setState({
    data: data.toString()
  });
});

const initialState = {
  peerCreated: false,
  offerCreated: false,
  offerImported: false,
  answerCreated: false,
  answerImported: false,
  connectionState: null,
  signalingState: null,
  initiator: false,
  videoURL: null,
  offer: null,
  data: null,
  error: [],
  clientConnected: false,
  ip: false
};

const configuration = { iceServers: [{ urls: [] }] };

const pc = new RTCPeerConnection(configuration);

pc.oniceconnectionstatechange = () => InitiatorComponent.setConnectionState();
pc.onsignalingstatechange = () => InitiatorComponent.setSignalingState();
pc.onaddstream = ({ stream }) => {
  InitiatorComponent.setState({
    receiverVideoURL: stream.toURL()
  });
};
pc.onicecandidate = async ({ candidate }) => {
  if (candidate === null) {
    const { offer } = InitiatorComponent.state;
    const field = !offer ? 'offer' : 'data';

    await InitiatorComponent.setState({
      [field]: JSON.stringify(pc.localDescription)
    });

    client.write(JSON.stringify(pc.localDescription));
  }
};

function createOffer() {
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer))
    .then(async () => {
      await InitiatorComponent.setState({
        offerCreated: true
      });
    })
    .catch(InitiatorComponent.logError);
}

function createAnswer() {
  const { data } = InitiatorComponent.state;

  if (data) {
    const sd = new RTCSessionDescription(JSON.parse(data));

    pc.setRemoteDescription(sd)
      .then(() => pc.createAnswer())
      .then(answer => pc.setLocalDescription(answer))
      .then(async () => {
        await InitiatorComponent.setState({
          offerImported: true,
          answerCreated: true
        });
      })
      .catch(InitiatorComponent.logError);
  }
}

function receiveAnswer() {
  const { data } = InitiatorComponent.state;
  const sd = new RTCSessionDescription(JSON.parse(data));

  return pc
    .setRemoteDescription(sd)
    .then(() => {
      InitiatorComponent.setState({
        answerImported: true
      });
    })
    .catch(InitiatorComponent.logError);
}

class InitiatorScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = initialState;

  componentDidMount() {
    DeviceInfo.getIPAddress().then(ip => this.setState({ ip }));

    InitiatorComponent = this;

    if (pc) {
      this.setState({
        peerCreated: true
      });
    }

    // Doc. : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceConnectionState
    this.setConnectionState();

    // Doc. : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/signalingState
    this.setSignalingState();
  }

  @autobind
  setConnectionState() {
    this.setState({
      connectionState: pc.iceConnectionState
    });
  }

  @autobind
  setSignalingState() {
    this.setState({
      signalingState: pc.signalingState
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
    pc.addStream(stream);

    await this.setState({ videoURL: stream.toURL() });

    if (this.state.initiator) {
      return createOffer();
    }

    return createAnswer();
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
      data,
      initiator,
      videoURL,
      receiverVideoURL,
      connectionState,
      signalingState,
      error,
      peerCreated,
      offerCreated,
      offerImported,
      answerCreated,
      answerImported,
      clientConnected,
      ip
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          {data && initiator && (
            <Button title="Import answer" onPress={receiveAnswer} />
          )}
          <ConnectionState text={connectionState} />
          <ConnectionState text={signalingState} />
          <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
            <Status text="Ip is" isTrue={ip} />
            <Status text="Client/server" isTrue={clientConnected} />
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
            title="Create offer"
            onPress={() => this.start(true)}
            disabled={false}
            placeholder="Offer"
            onChangeText={value => console.log(value)}
            value={offer}
            streamURL={videoURL}
          />
          <WebRTCView
            title="Create Answer"
            onPress={() => this.start()}
            disabled={data === null}
            placeholder="Paste initiator offer"
            onChangeText={value => console.log(value)}
            value={data}
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
