<template>
  <div class="m-12">
    <div id="main-content" class="container">
      <div class="flex flex-col items-center">
        <input
          :disabled="connected"
          v-model="name"
          class="w-1/3 h-10 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
          type="text"
          placeholder="Votre nom"
        />
        <div class="flex items-center justify-items-start mt-2 mb-12">
          <button
            v-if="!connected"
            id="connect"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
            type="submit"
            :disabled="connected == true"
            @click.prevent="connect"
          >
            Connect
          </button>
          <button
            v-else
            id="disconnect"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            :disabled="connected == false"
            @click.prevent="disconnect"
          >
            Disconnect
          </button>
        </div>
        <div v-if="connected" class="flex flex-col items-center">
          <div class="grid grid-cols-2 gap-4">
            <input
              :disabled="!connected"
              v-model="msgSend"
              class="w-full h-10 px-3 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
              type="text"
              placeholder="Votre message"
            />
            <button
              id="send"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
              type="submit"
              @click.prevent="send"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="connected"
        class="my-2 flex flex-col place-content-center bg-gray-200 rounded-lg shadow-lg"
      >
        <div v-for="(msg, index) in msgReceived" :key="index">
          <div
            :class="
              name === msg.from ? 'bg-gray-300' : ' float-right bg-blue-300'
            "
            class="w-3/4 mx-4 my-2 p-2 rounded-lg clearfix"
          >
            {{ msg.from }} : {{ msg.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
export default {
  name: "websocketdemo",
  data() {
    return {
      msgReceived: [],
      msgSend: null,
      connected: false,
      name: "",
    };
  },
  methods: {
    send2() {
      console.log("Send message:" + this.msgSend);
      if (this.stompClient && this.stompClient.connected) {
        const msg = { message: this.msgSend };
        this.stompClient.send("/app/msg", JSON.stringify(msg), {});
      }
    },
    send() {
      if (this.stompClient && this.stompClient.connected) {
        console.log("Send message:" + this.msgSend);
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ message: this.msgSend, from: this.name }),
        };
        fetch("http://localhost:8090/chat", requestOptions).catch((err) =>
          console.log(err)
        );
      }
    },
    connect() {
      this.socket = new SockJS("http://localhost:8090/chatWS");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        (frame) => {
          this.connected = true;
          console.log("frame", frame);
          this.stompClient.subscribe("/topic/messages", (tick) => {
            console.log("tick", tick);
            this.msgReceived.push(JSON.parse(tick.body));
            console.log("msgReceived", this.msgReceived);
          });
        },
        (error) => {
          console.err(error);
          this.connected = false;
        }
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
      this.connected = false;
    },
  },
};
</script>

<style scoped></style>
