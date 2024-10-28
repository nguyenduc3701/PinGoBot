const fs = require("fs");
const axios = require("axios");
const colors = require("colors");
const readline = require("readline");
const { DateTime } = require("luxon");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { questions, questionTypes, ToolName, METHOD } = require("./config");

const BaseRoot = require("./ultils");

class Tools extends BaseRoot {
  constructor() {
    super();
    this.toolsName = ToolName || "";
    this.version = "1.0";
    this.waitingTime = 0;
    this.userInfo = null;
    this.questionStatuses = {
      isClaimDaily: false,
    };
  }

  async renderQuestions() {
    for (let i = 0; i < questions.length; i++) {
      const questionAnswer = await this.askQuestion(questions[i].question);
      this.questionStatuses[questions[i].type] =
        questionAnswer.toLowerCase() === "y" ?? true;
    }
  }

  processAccount = async (queryId, dataUser) => {
    this.log(colors.yellow(`====== [Process Account] ======`));
    const token = await this.login(queryId);
    if (token) {
      // Logic here
      await this.dailyCheckInClaim();
      await this.farmingClaim();
      if (this.questionStatuses.isDoTask) {
        await this.resolveTask(queryId, dataUser, token);
      }
      if (this.questionStatuses.isWatchAds) {
        await this.watchAds(queryId, dataUser, token);
      }
      if (this.questionStatuses.isPlayGame) {
        await this.playGame(queryId, dataUser, token);
      }
      if (this.questionStatuses.isConnectWallet) {
        await this.connectWallets(queryId, dataUser, token);
      }
    }
  };

  login = async () => {
    console.log(colors.gray(`====== [Login] ======`));
    const header = this.buildHeaderPinGo();
    const request = {
      Authorization: queryId,
    };
    try {
      const response = await this.callApi(
        METHOD.POST,
        `https://pingo.work/api/auth/miniapp/login`,
        request,
        header
      );

      if (response && response.data.code === 200) {
        this.log(colors.green(`\Login Pin Go Succesfully!`));
        if (response.data.data) {
          this.userInfo = response.data.data;
        }
        return response.data.user;
      } else {
        this.log(colors.red(`Fail to login Pin Go!`));
      }
    } catch (error) {
      this.log(colors.red(`Fail to login Pin Go!`));
      return;
    }
  };

  dailyCheckInClaim = async (queryId, dataUser, token) => {
    this.log(colors.yellow(`====== [Daily Checkin Claim] ======`));
    const header = this.getHeader();
  };

  watchAds = async (queryId, dataUser, token) => {
    this.log(colors.yellow(`====== [Watch Ads] ======`));
    const header = this.getHeader();
  };

  farmingClaim = async (queryId, dataUser, token) => {
    this.log(colors.yellow(`====== [Farm Claim] ======`));
    const header = this.getHeader();
  };

  playGame = async (queryId, dataUser, token) => {
    this.log(colors.yellow(`====== [Play Game] ======`));
    const header = this.getHeader();
  };

  resolveTask = async (queryId, dataUser, token) => {
    this.log(colors.yellow(`====== [Resolve Task] ======`));
    const header = this.getHeader();
  };

  connectWallets = async (queryId, dataUser, token) => {
    this.log(colors.yellow(`====== [Connect Wallets] ======`));
    const wallets = this.getWalletFile();
    if (!wallets.length) return;
    const header = this.getHeader();
  };

  buildHeaderTools = () => {
    const excludeKey = ["Accept", "Origin", "Referer"];
    const addional = {
      Origin: "https://punny.pingo.work",
      Referer: "https://punny.pingo.work/",
      Accept: "application/json, text/plain, */*",
    };
    return this.buildHeader(addional, excludeKey);
  };

  async main() {
    this.renderFiglet(this.toolsName, this.version);
    await this.sleep(1000);
    await this.renderQuestions();
    await this.sleep(1000);
    const data = this.getDataFile();

    if (
      !this.questionStatuses.isPlayGame &&
      !this.questionStatuses.isWatchAds &&
      !this.questionStatuses.isDoTask &&
      !this.questionStatuses.isConnectWallet
    ) {
      return;
    }

    if (!data || data.length < 1) {
      this.log(colors.red(`Don't have any data. Please check file data.txt!`));
      await this.sleep(1000);
    }

    while (true) {
      for (let i = 0; i < data.length; i++) {
        const queryId = data[i];
        const dataUser = await this.extractUserData(queryId);
        await this.sleep(1000);
        this.log(
          colors.cyan(
            `----------------------=============----------------------`
          )
        );
        this.log(
          colors.cyan(
            `Working with user #${i + 1} | ${dataUser.user.first_name} ${
              dataUser.user.last_name
            }`
          )
        );
        await this.processAccount(queryId, dataUser);
      }
      const extraMinutes = 1 * 60;
      await this.countdown(this.waitingTime + extraMinutes);
    }
  }
}

const client = new Tools();
client.main().catch((err) => {
  client.log(err.message, "error");
});
