const mediaMinMax = require("postcss-media-minmax");
const customMedia = require("postcss-custom-media");
const jitProps = require("postcss-jit-props");
const autoprefixer = require("autoprefixer");
const OpenProps = require("open-props");

module.exports = {
  plugins: [mediaMinMax, customMedia, jitProps(OpenProps), autoprefixer],
};
