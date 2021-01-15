const { DefaultLogger, CustomLogger } = require("../lib/Logger");
const ChatModel = require("../model/ChatModel");
const GroupModel = require("../model/GroupModel");
const ChatRepo = require("../repository/ChatRepository");
const Notify= require("../model/NotifyListModel");
/**
 * 將紀錄進行合併寫入
 */
exports.updateRecords = async () => {
  let records = await ChatRepo.getAllExpRecords();
  let hashRecord = {};

  if (records.length === 0) {
    CustomLogger.info("mergeRecord", "無紀錄需要處理");
  }

  records.forEach(record => {
    hashRecord[record.userId] = hashRecord[record.userId] || 0;
    hashRecord[record.userId] += record.expUnit;
  });

  let userIds = Object.keys(hashRecord);

  await ChatRepo.initialUsers(userIds);
  await ChatModel.writeRecords(userIds.map(userId => ({ userId, experience: hashRecord[userId] })));
  await levelUpNotify( userIds.map(userId => ({ userId, experience: hashRecord[userId] })));
};

/**
 * 事件分析，將其處理成經驗累積
 * @param {botEvent} botEvent
 */
exports.handleEvent = async botEvent => {
  if (botEvent.source.type !== "group") return;
  if (botEvent.type !== "message" || botEvent.message.type !== "text") return;

  let { userId, groupId, displayName } = botEvent.source;
  if (!userId) return;

  let rate, additionRate;

  let { timestamp: currTS } = botEvent;
  let lastTouchTS = await ChatModel.getTouchTS(userId);
  let { count } = await GroupModel.getInfo(groupId);

  rate = getExpRate(currTS, lastTouchTS);
  additionRate = count ? getGroupExpAdditionRate(count) : 1;
  let globalRate = await ChatModel.getGlobalRate();
  let expUnit = getExpUnit(rate, additionRate, globalRate);

  DefaultLogger.info(
    "個人頻率倍率",
    rate,
    "群組倍率加成",
    additionRate,
    "經驗單位",
    expUnit,
    "伺服器倍率",
    globalRate,
    "群組人數",
    count,
    "Line名稱",
    displayName,
    "userId",
    userId
  );

  if (rate !== 0) {
    // 有成功獲得經驗再戳
    await ChatModel.touchTS(userId, currTS);
  }

  ChatModel.insertRecord(userId, expUnit);
};

/**
 * 根據頻率取得經驗倍率
 * @param {Number} now
 * @param {Number} last
 */
function getExpRate(now, last) {
  switch (true) {
    case !last:
      return 100;
    case now - last < 1000:
      return 0;
    case now - last < 2000:
      return 10;
    case now - last < 4000:
      return 50;
    case now - last < 6000:
      return 80;
    default:
      return 100;
  }
}

/**
 * 取得群組加成經驗倍率
 * @param {Number} memberCount 群組人數
 */
function getGroupExpAdditionRate(memberCount = 0) {
  if (memberCount < 5) return 1;
  return 1 + (memberCount - 5) * 0.02;
}

/**
 * 取得經驗單位
 * @param {Number} rate 個人倍率
 * @param {Nubmer} additionRate 群組加成
 * @param {Number} globalRate 伺服器倍率
 */
function getExpUnit(rate, additionRate, globalRate) {
  return Math.round((additionRate * rate * globalRate) / 100);
}


/**
 * 判斷升等
 */

async function levelUpNotify(record) {

  let user = {};

  let userIds = record.map(data => data.userId);
  let userDatas = await ChatModel.getUserDatas(userIds).catch(console.error);

  let exp_unit = await ChatModel.getExpUnit();
  let total_exp = exp_unit.map(function(data){
    return data.total_exp;
  })

  for(i=0; i<record.length; i++){
    user = await user_exp(record[i],userDatas);
    user.levelup = await exp_filter(user,total_exp,exp_unit);
    if( user.levelup != false){
      console.log(user.levelup);
     await Notify.insertNotifyList({token: "W2Eg4UCvsgWSBXkxnzzXj3GEJykubHoCjcgErILnghc", message: "Level Up to"+user.levelup});
    }
    else{
      console.log("沒有升等");
      await Notify.insertNotifyList({token: "W2Eg4UCvsgWSBXkxnzzXj3GEJykubHoCjcgErILnghc", message: "沒升等"});
    }
  }
}

/**
 * 取出每一位使用者的資料
 * @returns {Object<{after: int, now: int, getexp: int}>}
 */

function user_exp(id,userDatas){
  

  let user_exp = {};
  user_exp.id = id.userId;
  user_exp.after = userDatas.find(function(data){
    return data.userId === id.userId;
  }).exp

  user_exp.now = user_exp.after - id.experience;
  user_exp.getexp = id.experience;

  //console.log(user_exp);
  
  return user_exp;
}

/**
 * 比較total_exp看有沒有升等，有的話回傳升到哪等，沒有回傳false
 * @returns {Int<unit_level>}
 */

function exp_filter(user,total_exp,exp_unit){

  //取下限
  let lower_bound = total_exp.find(function(data){
    return data > user.now  ;
  })

  //取上限
  let upper_bound = total_exp.find(function(data){
    return data > user.after ;
  })
  //console.log(lower_bound);
  //console.log(upper_bound);

  //判斷該不該升等
  if(lower_bound != upper_bound){
    let unit_level = exp_unit.find(function(data){
      return lower_bound == data.total_exp;
    }).unit_level
    //console.log(unit_level);
    return unit_level;
  }
  else{
    return false;
  }
}