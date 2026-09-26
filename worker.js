// www.migueljfsc.dev → migueljfsc.dev, keeping the path; everything else is the built site.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.migueljfsc.dev") {
      url.hostname = "migueljfsc.dev";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
