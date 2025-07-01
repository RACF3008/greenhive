import axios from "axios";

const isServer = typeof window === "undefined";

const buildClient = () => {
  if (isServer) {
    const { cookies, headers } = require("next/headers");

    const cookieStore = cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c: any) => `${c.name}=${c.value}`)
      .join("; ");

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local", // production in-cluster
      headers: {
        Cookie: cookieHeader,
        ...headers(), // optionally pass through other headers (e.g. user-agent)
      },
    });
  } else {
    // Client-side
    return axios.create({
      baseURL: "/",
      withCredentials: true, // Important if you're calling from browser and using cookies
    });
  }
};

export default buildClient;
