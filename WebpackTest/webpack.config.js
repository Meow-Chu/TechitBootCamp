const path = require("path"); //노드js는 런타임이라 어떤 가상머신에서도 돌아갈 수 있음. 그래서 운영체제에 따라서 경로를 설정하는 문법이 조금씩 다른데 이것을 하나로 통합해주어 어떤 운영체제에서든 동일한 경로표현식을 만들어주는 path문법이다.
const webpack = require("webpack");

// 모듈을 밖으로 빼내는 노드JS문법. 엔트리 아웃풋 그리고 번들링 모드 설정가능
module.exports = {
  mode: "development",

  entry: {
    main: path.resolve("./src/app.js"),
  },

  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },

  module: {
    // 로더를 추가하는 장소입니다.
    rules: [
      // {
      //     test: /\.js$/,
      //     use: [
      //         path.resolve('./myLoader.js')
      //     ]
      // }
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 500,
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `마지막 빌드 시간은 : ${new Date().toLocaleString()} 입니다`,
    }),
  ],
};
