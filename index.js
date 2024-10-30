const colors = require("colors");
const { questions, ToolName, METHOD } = require("./config");

const BaseRoot = require("./ultils");

class Tools extends BaseRoot {
  constructor() {
    super();
    this.toolsName = ToolName || "";
    this.version = "0.1";
    this.waitingTime = 0;
    this.userInfo = null;
    this.quests = [];
    this.questionStatuses = {
      isClaimDaily: false,
    };
    this.delayTime = {
      dailyClaim: null,
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
    await this.sleep(1000);
    if (token) {
      // Logic here
      const addional = {
        Authorization: this.userInfo.token,
      };
      await this.buildHeader(addional);
      await this.sleep(1000);
      await this.dailyCheckInClaim(queryId, dataUser, token);
      // await this.sleep(1000);
      // await this.farmingClaim(queryId, dataUser, token);
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

  login = async (queryId) => {
    this.log(colors.yellow(`====== [Login] ======`));
    const header = this.buildHeaderTools();
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
        return response.data.data;
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
    await this.getListQuest();
    await this.sleep(1000);
    const header = await this.getHeader(
      { "Content-Length": 14, Accept: "application/json, text/plain, */*" },
      ["Accept"]
    );
    if (!this.quests.length) {
      this.log(colors.red(`Not found any quest!`));
    }
    if (this.delayTime.dailyClaim > new Date()) {
      this.log(colors.red(`Not time to daily claim yet.`));
    }
    const checkIn = this.quests.find(
      (q) => q.title === "Check-in" && q.id === 5
    );
    if (checkIn) {
      const request = { questsId: checkIn.id, checkIn: true };
      try {
        const response = await this.callApi(
          METHOD.POST,
          `https://pingo.work/api/punny/quests/verify`,
          request,
          header
        );
        if (response && response.data.code === 200) {
          this.log(colors.green(`Claim daily quest successfully!`));
          if (
            !this.delayTime.dailyClaim ||
            this.delayTime.dailyClaim < new Date()
          ) {
            this.delayTime.dailyClaim = this.addHoursToDatetime(new Date(), 24);
          }
        } else {
          this.log(colors.red(`Fail to claim daily quest!`));
        }
      } catch (error) {
        this.log(colors.red(`Fail to claim daily quest!`));
      }
    } else {
      this.log(colors.red(`Not found quest in list!`));
    }
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

  getListQuest = async () => {
    const header = await this.getHeader({}, ["Content-Type"]);
    try {
      const response = await this.callApi(
        METHOD.GET,
        `https://pingo.work/api/punny/quests/list`,
        null,
        header
      );
      if (response && response.data.code === 200) {
        this.log(colors.green(`Get list quest successfully!`));
        if (response.data.data) {
          this.quests = response.data.data;
        }
      } else {
        this.log(colors.red(`Fail to get list quest!`));
      }
    } catch (error) {
      this.log(colors.red(`Fail to get list quest!`));
    }
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

    if (!this.questionStatuses.isClaimDaily) {
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
