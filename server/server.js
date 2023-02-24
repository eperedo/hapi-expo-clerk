"use strict";

const Hapi = require("@hapi/hapi");
const clerk = require("@clerk/clerk-sdk-node");

clerk.setClerkApiKey("sk_test_XXX");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "0.0.0.0",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      const headers = request.headers;
      try {
        const clerkToken = headers.authorization.replace("Bearer ", "");
        const decodeInfo = clerk.decodeJwt(clerkToken);
        const sessionId = decodeInfo.payload.sid;

        const clerkSession = await clerk.sessions.verifySession(
          sessionId,
          clerkToken
        );

        if (clerkSession.status === "active") {
          return [
            {
              orderId: 1,
              totalProducts: 2,
              amount: 200,
            },
            {
              orderId: 2,
              totalProducts: 2,
              amount: 200,
            },
          ];
        }
      } catch (error) {
        console.log("verifySession:error", error.message);
        return h
          .response({
            error: error.message,
          })
          .code(401);
      }
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
