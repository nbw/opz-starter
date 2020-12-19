class Midi {
  constructor() {
    this.self = this;
    this.devices = [];
    this.supported = this.checkMidiSupport();
  }

  setup() {
    navigator.requestMIDIAccess()
      .then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
  }

  onMIDISuccess(midiAccess) {
    const inputs = midiAccess.inputs.values();
    for (let input of midiAccess.inputs.values()) {
      this.devices.push(input);
    }
  }

  onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
  }

  checkMidiSupport() {
    if (navigator.requestMIDIAccess) {
      console.log('This browser supports WebMIDI!');
      return true;
    } else {
      console.log('WebMIDI is not supported in this browser.');
      return false;
    }
  }

  selectDevice(deviceIndex, handler) {
    const device = this.devices[deviceIndex]
    device.onmidimessage = handler;
    return `Connected to "${device.name}"`;
  }
}

export default Midi;

