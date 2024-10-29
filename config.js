const questionTypes = {
  IS_DAILY_CLAIM: "isClaimDaily",
};

const questions = [
  {
    type: questionTypes.IS_DAILY_CLAIM,
    question: "Do you want to claim daily?(y/n): ",
  },
];

const METHOD = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
};

const ToolName = "PinGo";

module.exports = { questions, questionTypes, ToolName, METHOD };
