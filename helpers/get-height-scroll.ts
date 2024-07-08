function getHeightScroll() {
  if (typeof window !== "undefined") {
    // detect window screen width function
    let windowHeight = window.innerHeight;
    return windowHeight < 700 ? 240 : 0.5 * windowHeight;
  } else {
    return 240;
  }
}
export default getHeightScroll;
