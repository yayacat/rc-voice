/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Channel, User } from '@/types';
import { Socket } from 'socket.io-client';

interface UserCall {
    userId: string;
    username: string;
    isSpeaker: boolean;
    isMuted: boolean;
}

class Call {
    socket: Socket;
    currentRoom: string | null;
    isSpeaker: boolean;
    audioContext!: AudioContext;
    sourceNode!: MediaStreamAudioSourceNode;
    processorNode!: ScriptProcessorNode;
    isMuted: boolean;
    stream: MediaStream | null;
    currentUsers: UserCall[] = []; // Initialize with empty array of User type
    channel: Channel;
    user: User;
    userListDiv: any;
    source: any;
    username!: string;
    analyser!: AnalyserNode;

    constructor(socket: Socket,channel: Channel, user: User) {
        this.socket = socket;
        this.channel = channel;
        this.user = user;
        this.currentRoom = null;
        this.isSpeaker = false;
        this.isMuted = false;
        this.stream = null;
        if (this.socket) this.initialize();
    }
    initialize() {
        this.socket.on("update-users-list", (users: User[]) => console.log(users));
        // this.socket.on("user-speaking", ({ userId, isSpeaking, volume }: { userId: string, isSpeaking: boolean, volume: number }) => this.handleUserSpeaking(userId, isSpeaking, volume));
        this.socket.on("audio-stream", ({ from, data }: { from: string | undefined, data: ArrayBuffer }) => from != this.socket.id ? this.playAudioStream(data) : void 0);
        this.socket.on("update-disconnect", () => this.disconnectAudioStream());
        // this.socket.on("room-list", (rooms: string[]) => this.displayRooms(rooms));
        // this.socket.emit("get-rooms");
        // const room = new URLSearchParams(window.location.search).get("room");
        // if (room) {
        //     this.joinRoom(room);
        // }
        if (this.channel) this.joinRoom(this.channel.id);
    }
    /**加入房間(這裡我直接傳入room id)**/
    async joinRoom(room: string): Promise<void> {
        this.username = this.user.id;
        // this.isSpeaker = confirm("是否要開啟麥克風？（取消則進入旁聽模式）");
        this.isSpeaker = true;
        if (this.isSpeaker) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    }
                });
                this.startBroadcasting(stream);
            } catch (error) {
                alert("無法存取麥克風，已進入旁聽模式");
                this.isSpeaker = false;
            }
        } else {
            this.setupAudioPlayback();
        }
        this.currentRoom = room;
        this.socket.emit("join-room", { room, isSpeaker: this.isSpeaker, username: this.username });
    }
    /**開始廣播**/
    startBroadcasting(stream: MediaStream) {
        this.audioContext = new (window.AudioContext || window.AudioContext)();
        this.sourceNode = this.audioContext.createMediaStreamSource(stream);
        this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.fftSize = 512;
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.processorNode);
        const silentGain = this.audioContext.createGain();
        silentGain.gain.value = 0;
        this.processorNode.connect(silentGain);
        silentGain.connect(this.audioContext.destination);
        this.processorNode.onaudioprocess = (event) => {
            const buffer = event.inputBuffer.getChannelData(0);
            const int16Array = this.convertFloat32ToInt16(buffer);
            const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(dataArray);
            let volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            let isSpeaking = volume > 10;
            if (this.isMuted) {
                volume = 0;
                isSpeaking = false;
            }
            this.socket.emit("user-speaking", { room: this.currentRoom, isSpeaking, volume });
            if (this.isMuted) {
                const silentData = new Int16Array(4096).buffer;
                this.socket.emit("audio-data", { room: this.currentRoom, data: silentData });
            } else {
                this.socket.emit("audio-data", { room: this.currentRoom, data: int16Array.buffer });
            }
        };
    }
    /**轉換結構**/
    convertFloat32ToInt16(buffer: Float32Array): Int16Array {
        const int16Array = new Int16Array(buffer.length);
        for (let i = 0; i < buffer.length; i++) {
            int16Array[i] = buffer[i] * 32767;
        }
        return int16Array;
    }
    /**設定音流播放**/
    setupAudioPlayback() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.AudioContext)();
        }
    }
    /**播放音流**/
    playAudioStream(data: ArrayBuffer) {
        if (!this.audioContext) this.setupAudioPlayback();
        if (!data || !(data instanceof ArrayBuffer)) return console.error("Invalid audio data received");
        const int16Array = new Int16Array(data);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32767;
        }
        const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, this.audioContext.sampleRate);
        if (!audioBuffer || !this.audioContext) return; // Ensure audioBuffer and audioContext are not null
        audioBuffer.copyToChannel(float32Array, 0);
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = audioBuffer;
        this.source.connect(this.audioContext.destination);
        this.source.start();
    }

    /**停止播放音流**/
    disconnectAudioStream() {
        this.source?.stop();
        this.audioContext = new (window.AudioContext || window.AudioContext)();
        this.processorNode.disconnect();
        this.sourceNode.disconnect();
        this.analyser.disconnect();
        console.log("Call disconnected");
    }
    /**切換靜音(個人)**/
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.stream) {
            this.stream.getAudioTracks().forEach(track => {
                track.enabled = !this.isMuted;
            });
        }
        this.socket.emit("toggle-mute", { room: this.currentRoom, userId: this.socket.id, isMuted: this.isMuted });
    }
    /**更新使用者列表**/
	updateUserList(users: UserCall[]) {
		this.currentUsers = users;
		this.userListDiv.innerHTML = "";
		users.forEach((user: UserCall) => {
			// 使用者ID
			const userItem = document.createElement("div");
			userItem.id = `user-${user.userId}`;
			userItem.style.display = "flex";
			userItem.style.alignItems = "center";
			userItem.style.marginBottom = "5px";

			// 使用者名稱
			const usernameText = document.createElement("span");
			usernameText.textContent = `${user.username} (${user.isSpeaker ? "發言者" : "聽眾"})`;
			usernameText.style.width = "150px";
			usernameText.style.textAlign = "left";

			// 靜音emoji
			const muteIcon = document.createElement("span");
			muteIcon.id = `mute-icon-${user.userId}`;
			muteIcon.textContent = user.isMuted ? "🔇" : "";
			muteIcon.style.marginLeft = "5px";
			muteIcon.style.color = "red";

			// 背景音量條
			const volumeBar = document.createElement("div");
			volumeBar.id = `volume-${user.userId}`;
			volumeBar.style.width = "100px";
			volumeBar.style.height = "10px";
			volumeBar.style.backgroundColor = "#ccc";
			volumeBar.style.borderRadius = "5px";
			volumeBar.style.marginLeft = "10px";

			// 綠色音量條
			const volumeFill = document.createElement("div");
			volumeFill.style.height = "100%";
			volumeFill.style.width = "0%";
			volumeFill.style.backgroundColor = "limegreen";
			volumeFill.style.borderRadius = "5px";
			volumeFill.style.transition = "width 0.1s linear";
			volumeFill.id = `volume-fill-${user.userId}`;

			volumeBar.appendChild(volumeFill);
			userItem.appendChild(usernameText);
			userItem.appendChild(volumeBar);
			userItem.appendChild(muteIcon);
			this.userListDiv.appendChild(userItem);
		});
	}
    /**處理說話**/
    handleUserSpeaking(userId: string, isSpeaking: boolean, volume: number) {
        const volumeFill = document.getElementById(`volume-fill-${userId}`) as HTMLElement | null;
        if (volumeFill) {
            volumeFill.style.width = `${Math.min(100, Math.max(0, (volume / 50) * 100))}%`;
        }
        this.highlightUser(userId, isSpeaking);
    }
    /**處理說話顏色、靜音**/
    highlightUser(userId: string, isSpeaking: boolean) {
        const userElement = document.getElementById(`user-${userId}`) as HTMLElement | null;
        const muteIcon = document.getElementById(`mute-icon-${userId}`) as HTMLElement | null;
        if (userElement) {
            const userData = this.getUserDataById(userId);
            if (userData && userData.isMuted) {
                userElement.style.color = "black";
                if (muteIcon) muteIcon.textContent = "🔇";
            } else {
                userElement.style.color = isSpeaking ? "red" : "black";
                if (muteIcon) muteIcon.textContent = "";
            }
        }
    }
    /**取得使用者ID**/
    getUserDataById(userId: string): UserCall | undefined {
        const users = this.currentUsers || [];
        return users.find(user => user.userId == userId);
    }
}

export default Call;