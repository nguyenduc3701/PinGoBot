const questionTypes = {
  IS_PLAY_GAME: "isPlayGame",
  IS_WATCH_ADS: "isWatchAds",
  IS_DO_TASK: "isDoTask",
  IS_CONNECT_WALLET: "isConnectWallet",
};

const questions = [
  {
    type: questionTypes.IS_PLAY_GAME,
    question: "Do you want to play game?(y/n): ",
  },
  {
    type: questionTypes.IS_WATCH_ADS,
    question: "Do you want to watch ads?(y/n): ",
  },
  {
    type: questionTypes.IS_DO_TASK,
    question: "Do you want to do task?(y/n): ",
  },
  {
    type: questionTypes.IS_CONNECT_WALLET,
    question: "Do you want to connect wallet?(y/n): ",
  },
];

const METHOD = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
};

const ToolName = "MyTools";

module.exports = { questions, questionTypes, ToolName, METHOD };
