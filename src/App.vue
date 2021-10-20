<template>
  <div class="p-12">
    <div class="flex place-content-center">
      <h1 class="text-2xl text-green-400 font-extrabold">
        Vue Chat WebSocket with RethinkDb
      </h1>
    </div>

    <websocket-chat></websocket-chat>
  </div>
</template>

<script>
import WebsocketChat from "@/components/WebsocketChat.vue";
export default {
  name: "App",
  components: {
    WebsocketChat,
  },
};
</script>
