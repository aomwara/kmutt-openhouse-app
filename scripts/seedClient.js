// scripts/seedClient.ts
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const clientId = crypto.randomBytes(8).toString("hex");
  const clientSecret = crypto.randomBytes(16).toString("hex");

  const client = await prisma.oAuthClient.create({
    data: {
      name: "Example Client",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: "https://example-client.com/oauth/callback", // comma separated
    },
  });

  console.log("Client created:");
  console.log("client_id:", client.client_id);
  console.log("client_secret:", client.client_secret);
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));
