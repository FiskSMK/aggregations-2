// run: node convert-dates.js > converted.out

var entries = [
        {
          "count": 1,
          "time": 1164931200000
        },
        {
          "count": 2,
          "time": 1167609600000
        },
        {
          "count": 2,
          "time": 1.170288e+12
        },
        {
          "count": 1,
          "time": 1172707200000
        },
        {
          "count": 1,
          "time": 1175385600000
        },
        {
          "count": 1,
          "time": 1196467200000
        },
        {
          "count": 1,
          "time": 1212278400000
        },
        {
          "count": 2,
          "time": 1214870400000
        },
        {
          "count": 19,
          "time": 1217548800000
        },
        {
          "count": 28,
          "time": 1220227200000
        },
        {
          "count": 128,
          "time": 1222819200000
        },
        {
          "count": 294,
          "time": 1225497600000
        },
        {
          "count": 115,
          "time": 1228089600000
        },
        {
          "count": 282,
          "time": 1.230768e+12
        },
        {
          "count": 119,
          "time": 1233446400000
        },
        {
          "count": 218,
          "time": 1235865600000
        },
        {
          "count": 344,
          "time": 1.238544e+12
        },
        {
          "count": 389,
          "time": 1.241136e+12
        },
        {
          "count": 586,
          "time": 1243814400000
        },
        {
          "count": 808,
          "time": 1246406400000
        },
        {
          "count": 2301,
          "time": 1249084800000
        },
        {
          "count": 2748,
          "time": 1251763200000
        },
        {
          "count": 8904,
          "time": 1254355200000
        },
        {
          "count": 16751,
          "time": 1257033600000
        },
        {
          "count": 43289,
          "time": 1259625600000
        },
        {
          "count": 34958,
          "time": 1.262304e+12
        },
        {
          "count": 32006,
          "time": 1264982400000
        },
        {
          "count": 65592,
          "time": 1267401600000
        },
        {
          "count": 51768,
          "time": 1.27008e+12
        },
        {
          "count": 51585,
          "time": 1.272672e+12
        },
        {
          "count": 85401,
          "time": 1275350400000
        },
        {
          "count": 199294,
          "time": 1277942400000
        },
        {
          "count": 256512,
          "time": 1280620800000
        },
        {
          "count": 312460,
          "time": 1283299200000
        },
        {
          "count": 304326,
          "time": 1285891200000
        },
        {
          "count": 362662,
          "time": 1288569600000
        },
        {
          "count": 302035,
          "time": 1291161600000
        },
        {
          "count": 496329,
          "time": 1.29384e+12
        },
        {
          "count": 428525,
          "time": 1296518400000
        },
        {
          "count": 441130,
          "time": 1298937600000
        },
        {
          "count": 538690,
          "time": 1.301616e+12
        },
        {
          "count": 630517,
          "time": 1.304208e+12
        },
        {
          "count": 700685,
          "time": 1306886400000
        },
        {
          "count": 954233,
          "time": 1309478400000
        },
        {
          "count": 947335,
          "time": 1312156800000
        },
        {
          "count": 1148994,
          "time": 1314835200000
        },
        {
          "count": 1503366,
          "time": 1317427200000
        },
        {
          "count": 1810790,
          "time": 1320105600000
        },
        {
          "count": 1088950,
          "time": 1322697600000
        },
        {
          "count": 1145836,
          "time": 1.325376e+12
        },
        {
          "count": 1382174,
          "time": 1328054400000
        },
        {
          "count": 1643917,
          "time": 1.33056e+12
        },
        {
          "count": 1687831,
          "time": 1333238400000
        },
        {
          "count": 1081307,
          "time": 1335830400000
        }
      ];

for(var i = 0; i < entries.length; i++){
  entries[i].time = new Date(entries[i].time);
  entries[i].time = (entries[i].time.getUTCMonth()+1) + "." + entries[i].time.getUTCFullYear();
};

console.log(entries);