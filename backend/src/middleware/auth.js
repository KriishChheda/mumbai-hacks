import { OAuth2Client } from "google-auth-library";
import { prisma } from "../../prisma/client.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Missing token" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          googleId: payload.sub,
        },
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
};
