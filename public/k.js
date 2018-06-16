var Kline = function () {

};
Kline.prototype = {
    宽: null,
    高: null,
    分时url: null,
    开: null,
    昨收: null,
    分时数据: [],
    定时器: null,
    画布: null,//document.getElementById("myCanvas")
    画布上下文: null,
    画布宽度: null,
    画布高度: null,
    K线区宽度: null,
    K线区高度: null,
    量区宽度: null,
    量区高度: null,
    MACD区宽度: null,
    MACD区高度: null,
    MACD区间隔: 10,
    量区间隔: 50,
    画布id: null,
    类型: null,
    代码: null,
    第一次加载数据: false,
    定时: 1000,
    请求地址: "http://139.196.177.90:2661/index/k",
    左边距: 10,
    左线边距: 60,
    右边距: 15,
    底边距: 18,
    上边距: 20,//20
    开始条数: 0,
    结束条数: 0,
    k线柱宽度: 6,
    k线柱间隔: 3,
    K线显示柱条数: 100,
    高度价格比列: 0,
    量高度价格比列: 0,
    平仓数据: { 数手: 0 },
    量数组: [],
    新量数组: [],
    均线: [],
    新数组: [],
    M5: [],
    M10: [],
    M15: [],
    量计算数据: {},
    计算数据: {},
    拖动开始x: 0,
    拖动结束x: 0,
    十字线显示: false,
    放大: false,
    数据长度: 0,
    最后一柱: null,
    实时线颜色: "#ff0000",
    K柱阴颜色: "#00b333",
    K柱阳颜色: "#e92e10",
    均线颜色: "#fd4801",
    M5颜色: "#b2ff94",
    M10颜色: "#94e2ff",
    M15颜色: "#ffe594",
    量柱颜色: "#00a50c",
    量柱颜色1: "#e92e10",
    时间颜色: "#ff0000",
    价格颜色: "#ff0000",
    买颜色: "#fd00ca",
    卖颜色: "#0095fd",
    最新价颜色: "#0cff00",
    显示文本颜色: "#ffffff",
    分时线颜色: "#ff0000",
    分时刻度颜色: "#444444",
    分时刻度文字颜色: "#c3c3c3",
    十字线颜色: "#c3c3c3",
    量区比列: 0.7,
    市价: null,
    go: function () {
        var self = this;
        self.chushi();
        $.connection.hub.start().done(function () {
            work.server.k线(self.代码, self.类型, "");
        });
        // self.getdata();
    },
    chushi: function () {
        var self = this;
        self.分时数据 = [];
        console.log(self.分时数据);
        // self.量数组= [];
        // self.新量数组= [];
        // self.均线= [];
        // self.新数组= [];
        // self.M5= [];
        // self.M10= [];
        // self.M15= [];
        self.画布 = document.getElementById(self.画布id);
        self.画布上下文 = self.画布.getContext("2d");
        self.画布.width = self.宽 * 2;
        self.画布.height = self.高 * 2;
        // self.画布上下文.clearRect(0,0,self.画布.width,self.画布.height);
        self.画布宽度 = self.宽 * 2;
        self.画布高度 = self.高 * 2;
        self.K线区宽度 = self.画布宽度;
        self.K线区高度 = self.画布高度 * self.量区比列;
        self.量区宽度 = self.画布宽度;
        self.量区高度 = (self.画布高度 - self.K线区高度);
        self.MACD区宽度 = self.画布宽度;
        self.MACD区高度 = self.画布高度 - self.K线区高度 - self.量区高度;

        self.画布上下文.translate(0.5, 0.5);
        self.画布上下文.lineWidth = 1;
        self.loading();
        self.eve();
    },
    loading: function () {
        var self = this;
        self.画布上下文.font = "19px sans-serif";
        self.画布上下文.fillStyle = '#aaa';
        self.画布上下文.fillText("数据加载中..", (self.画布宽度 / 2) - 50, (self.画布高度 / 2) - 10);
        self.画布上下文.save();
    },
    getdata: function (data) {
      // alert(JSON.stringify(data))
        var self = this;
        if (self.第一次加载数据 == false) {
            if (data.length == 0) {
                self.画布上下文.clearRect(0, 0, self.画布宽度, self.画布高度);
                self.画布上下文.font = "19px sans-serif";
                self.画布上下文.fillStyle = '#aaa';
                self.画布上下文.fillText("未开盘", (self.画布宽度 / 2) - 50, (self.画布高度 / 2) - 10);
                self.画布上下文.save();
                return;
            };
            for (var i = 0; i < data.length; i++) {
                self.分时数据.push({ 市价: data[i]["现价"], 时间: data[i]["结束时间"], 开盘: Number(data[i]["开仓"]), 收盘: Number(data[i]["收盘"]), 最高: Number(data[i]["最高"]), 最低: Number(data[i]["最低"]), 量: Number(data[i]["量"]), 存收: Number(data[i]["收盘"]) });
            };
            self.分时数据[0]["量"] = 0;
            self.分时数据[self.分时数据.length - 1]["收盘"] = self.分时数据[self.分时数据.length - 1]["现价"];
            self.昨收 = Number(data[0]["昨收"]);
            var zh = data[data.length - 1];
            self.市价 = zh.现价;
            self.最后一柱 = zh;

            var a = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / self.K线显示柱条数;
            self.k线柱宽度 = a * 0.7;
            self.k线柱间隔 = a - self.k线柱宽度;
            self.开始条数 = (self.分时数据.length - self.K线显示柱条数) < 0 ? 0 : self.分时数据.length - self.K线显示柱条数;
            self.结束条数 = (self.开始条数 + self.K线显示柱条数) > self.分时数据.length ? self.分时数据.length : (self.开始条数 + self.K线显示柱条数);
            self.kuanjia();
        } else {
            if (data.length == 0) {
                return;
            };
            if (data.length == 1) {
                self.分时数据[self.分时数据.length - 1]["收盘"] = data[0]["现价"] == 0 ? self.分时数据[self.分时数据.length - 1]["收盘"] : data[0]["现价"] ;
            } else if (data.length > 1) {
                var 差 = data.length - 1;
                self.开始条数 += 差;
                self.结束条数 += 差;
                self.分时数据[self.分时数据.length - 1]["收盘"] = self.分时数据[self.分时数据.length - 1]["存收"];
                for (var i = 0; i < data.length; i++) {
                    if (i>0) {
                        self.分时数据.push({ 市价: data[i]["现价"], 时间: data[i]["结束时间"], 开盘: Number(data[i]["开仓"]), 收盘: Number(data[i]["收盘"]), 最高: Number(data[i]["最高"]), 最低: Number(data[i]["最低"]), 量: Number(data[i]["量"]), 存收: Number(data[i]["收盘"]) });
                    };
                };
            };
            var zh = data[data.length - 1];
            self.市价 = zh.现价;
            self.最后一柱 = zh;
            if (self.十字线显示 == false && self.放大 == false) {
                self.kuanjia();
            };

        };
        self.第一次加载数据 = true;
        self.数据长度 = self.分时数据.length;
        window.setTimeout(function () {
            work.server.k线(self.代码, self.类型, self.最后一柱.结束时间);
        }, 500);
    },
    jishuan: function () {
        var self = this;
        var a = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / self.K线显示柱条数;
        self.k线柱宽度 = a * 0.7;
        self.k线柱间隔 = a - self.k线柱宽度;
        self.开始条数 = (self.结束条数 - self.K线显示柱条数) < 0 ? 0 : self.结束条数 - self.K线显示柱条数;
        self.结束条数 = (self.开始条数 + self.K线显示柱条数) > self.分时数据.length ? self.分时数据.length : (self.开始条数 + self.K线显示柱条数);
        self.kuanjia();
    },
    kuanjia: function () {
        var self = this;
        if (self.分时数据.length <= 0) {
            return;
        };

        self.画布上下文.clearRect(0, 0, self.画布宽度, self.画布高度);
        self.画布上下文.font = "15px sans-serif";
        if (self.分时数据.length > 0) {

            var 收盘价 = [];
            self.新数组 = [];
            self.M5 = [];
            self.M10 = [];
            self.M15 = [];
            self.MACD = [];
           // alert(JSON.stringify(self.计算数据));
            var kd;
            if (self.类型 == "分时") {
                self.计算数据 = self.getlendata(self.分时数据);
                //for (var i = 0; i < self.分时数据.length; i++) {
                //    if (i == 0) {
                //        var macdiem = {
                //            EMA12: 0,
                //            EMA26: 0,
                //            DIFF: 0,
                //            DEA: 0,
                //            BAR: 0,
                //            收盘价: self.分时数据[i].收盘
                //        };
                //        self.MACD.push(macdiem);
                //    } else {
                //        var EMA12 = self.MACD[i - 1].EMA12 * 11 / 13 + self.分时数据[i].收盘 * 2 / 13
                //        var EMA26 = self.MACD[i - 1].EMA12 * 25 / 27 + self.分时数据[i].收盘 * 2 / 27;
                //        var DIFF = EMA12 - EMA26;
                //        var DEA = self.MACD[i - 1].DEA * 8 / 10 + DIFF * 2 / 10;
                //        var macdiem = {
                //            EMA12: EMA12,
                //            EMA26: EMA26,
                //            DIFF: DIFF,
                //            DEA: DEA,
                //            BAR: 2 * (DIFF - DEA),
                //            收盘价: self.分时数据[i].收盘
                //        };
                //        self.MACD.push(macdiem);
                //    }
                //};

            } else {
                for (var i = self.开始条数; i < self.结束条数; i++) {
                    self.新数组.push(self.分时数据[i]);
                    if (self.结束条数 <= self.分时数据.length) {
                        收盘价.push(Number(self.分时数据[i].收盘));
                    } else {
                        收盘价.push(0);
                    }

                };

                self.计算数据 = self.getlendata(self.新数组);
               // alert(JSON.stringify(self.计算数据));
                kd = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / self.新数组.length;
                self.画布上下文.fillStyle = self.M5颜色;
                self.画布上下文.fillText("●M5", self.左边距 + self.左线边距, 30);
                self.画布上下文.save();
                self.画布上下文.fillStyle = self.M10颜色;
                self.画布上下文.fillText("●M10", self.左边距 + self.左线边距 + 150, 30);
                self.画布上下文.save();
                self.画布上下文.fillStyle = self.M15颜色;
                self.画布上下文.fillText("●M15", self.左边距 + self.左线边距 + 300, 30);
                self.画布上下文.save();
            };
            self.高度价格比列 = (self.K线区高度 - self.底边距 - self.上边距) / Math.abs(self.计算数据.最大值 - self.计算数据.最小值);

            //////////////////////////////////////////////////////////////////////////////////
            if (self.类型 == "分时") {
                self.画布上下文.fillStyle = '#fff';
                self.画布上下文.font = "80px sans-serif";
                self.画布上下文.fillText(self.市价, self.左边距 + self.左线边距 + 20, 100);


                self.画布上下文.font = "15px sans-serif";
                self.画布上下文.fillStyle = '#307208';
                var d2 = self.计算数据.最大值 - (self.计算数据.最大值 - self.昨收) / 2;
                var j = ((self.计算数据.最大值 - d2) * self.高度价格比列) + self.上边距;
                self.画布上下文.fillText(d2.toFixed(2), self.左边距, j + 6);
                self.画布上下文.save();
                self.画布上下文.strokeStyle = self.分时刻度颜色;
                self.画布上下文.beginPath();
                self.画布上下文.moveTo(self.左边距 + self.左线边距, j);
                self.画布上下文.lineTo(self.K线区宽度 - self.右边距, j);
                self.画布上下文.stroke();
                self.画布上下文.save();
                //////////////////////////////////////////////////////////////////////////////////
                self.画布上下文.strokeStyle = self.分时刻度颜色;
                var ty = ((self.计算数据.最大值 - self.昨收) * self.高度价格比列) + self.上边距;
                self.画布上下文.beginPath();
                self.画布上下文.moveTo(self.左边距 + self.左线边距, ty);
                self.画布上下文.lineTo(self.K线区宽度 - self.右边距, ty);
                self.画布上下文.stroke();
                self.画布上下文.save();
                self.画布上下文.fillStyle = '#b3a400';
                self.画布上下文.fillText(self.昨收.toFixed(2), self.左边距, ty + 6);
                self.画布上下文.save();
                //////////////////////////////////////////////////////////////////////////////////
                self.画布上下文.fillStyle = '#e92e10';
                var d1 = (self.昨收 - (self.昨收 - self.计算数据.最小值) / 2);
                var j = ((self.计算数据.最大值 - d1) * self.高度价格比列) + self.上边距;
                self.画布上下文.fillText(d1.toFixed(2), self.左边距, j + 6);
                self.画布上下文.save();
                self.画布上下文.strokeStyle = self.分时刻度颜色;
                self.画布上下文.moveTo(self.左边距 + self.左线边距, j);
                self.画布上下文.lineTo(self.K线区宽度 - self.右边距, j);
                self.画布上下文.stroke();
                self.画布上下文.save();
                ////////////////////////////////////////////////////////////////////////////////
                var z = ((self.计算数据.最大值 - self.昨收) / self.昨收) * 100;
                self.画布上下文.fillStyle = '#307208';
                self.画布上下文.fillText(z.toFixed(2) + "%", self.K线区宽度 - self.右边距 - 50, self.上边距 + 18);
                self.画布上下文.save();
                var z = ((self.计算数据.最小值 - self.昨收) / self.昨收) * 100;
                self.画布上下文.fillStyle = '#e92e10';
                self.画布上下文.fillText(z.toFixed(2) + "%", self.K线区宽度 - self.右边距 - 50, self.K线区高度 - self.底边距 - 7);
                self.画布上下文.save();

                /////////////////////////////////////////////////////////////////////////////////////////////////////

                self.画布上下文.fillStyle = self.分时刻度文字颜色;
                var ww = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / 555;
                for (var i = 0; i <= 555; i++) {
                    if (i == 0 || i % 111 == 0) {
                        var x, xx;
                        if (i == 555) {
                            x = self.K线区宽度 - self.右边距 - 30;
                            xx = self.K线区宽度 - self.右边距;
                        } else if (i == 0) {
                            x = i * ww + self.左边距 + self.左线边距;
                            xx = i * ww + self.左边距 + self.左线边距;
                        }
                        else {
                            x = i * ww + self.左边距 + self.左线边距 - 15;
                            xx = i * ww + self.左边距 + self.左线边距;
                        };
                        self.画布上下文.fillText(self.time1(i), x, self.K线区高度);
                        self.画布上下文.strokeStyle = self.分时刻度颜色;
                        self.画布上下文.beginPath();
                        self.画布上下文.moveTo(xx, self.上边距);
                        self.画布上下文.lineTo(xx, self.K线区高度 - self.底边距);
                        self.画布上下文.stroke();
                        self.画布上下文.save();

                    }
                };


                self.画布上下文.strokeStyle = "#ffffff";
                for (var i = 0; i <= 555; i++) {
                    if (i < self.分时数据.length) {
                        if (i > 0 && self.分时数据[i - 1].收盘 > 0) {
                            var 起x = ww * (i - 1) + self.左边距 + self.左线边距;
                            var 起y = (self.计算数据.最大值 - self.分时数据[i - 1].收盘) * self.高度价格比列 + self.上边距;
                            var 始x = ww * i + self.左边距 + self.左线边距;
                            var 始y = (self.计算数据.最大值 - self.分时数据[i].收盘) * self.高度价格比列 + self.上边距;
                            self.画布上下文.beginPath();
                            self.画布上下文.moveTo(起x, 起y);
                            self.画布上下文.lineTo(始x, 始y);
                            self.画布上下文.stroke();
                            self.画布上下文.save();
                        }
                    }
                };

                var 收盘价 = [];
                self.均线 = [];
                for (var i = 0; i < self.分时数据.length; i++) {
                    收盘价.push(self.分时数据[i].收盘);

                };
                for (var i = 0; i < 收盘价.length; i++) {
                    self.均线.push(Number(self.junjia(收盘价, i + 1)));
                };

                self.画布上下文.strokeStyle = '#ff5400';
                for (var i = 0; i < self.均线.length; i++) {
                    if (i > 0) {
                        var 均线起x = ww * (i - 1) + self.左边距 + self.左线边距;
                        var 均线起y = (self.计算数据.最大值 - self.均线[i - 1]) * self.高度价格比列 + self.上边距;
                        var 均线始x = ww * i + self.左边距 + self.左线边距;
                        var 均线始y = (self.计算数据.最大值 - self.均线[i]) * self.高度价格比列 + self.上边距;
                        self.画布上下文.beginPath();
                        self.画布上下文.moveTo(均线起x, 均线起y);
                        self.画布上下文.lineTo(均线始x, 均线始y);
                        self.画布上下文.stroke();
                        self.画布上下文.save();
                    }
                };

                self.量高度价格比列 = (self.量区高度 - self.量区间隔) / Math.abs(self.计算数据.量最大值 - self.计算数据.量最小值);
                for (var i = 0; i <= 555; i++) {
                    if (i < self.分时数据.length) {
                        var 量柱高度 = self.分时数据[i].量 * self.量高度价格比列;
                        var 量柱X = i * ww + self.左边距 + self.左线边距;
                        var 量柱Y = self.K线区高度 + self.量区间隔 + (self.计算数据.量最大值 - self.分时数据[i].量) * self.量高度价格比列;
                        self.画布上下文.beginPath();
                        if (self.分时数据[i].收盘 > self.均线[i]) {
                            self.画布上下文.fillStyle = self.量柱颜色;
                        } else {
                            self.画布上下文.fillStyle = self.量柱颜色1;
                        }
                        self.画布上下文.fillRect(量柱X, 量柱Y, ww - 0.7, 量柱高度);
                        self.画布上下文.stroke();
                        self.画布上下文.save();
                    }
                };


                //var macd数据 = self.MACDlen(self.MACD);
                //var ab = macd数据.最小值 < 0 ? Math.abs(macd数据.最小值) + macd数据.最大值 : macd数据.最大值 - macd数据.最小值
                //var MACD高度价格比列 = (self.MACD区高度 - self.MACD区间隔 - self.底边距)  / Math.abs(ab);
                //var kd = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / 555;
                //var BAR高度价格比列 = (self.MACD区高度 - self.MACD区间隔 - self.底边距) / 2 / macd数据.BAR最大值;
                //for (var i = 0; i <= 555; i++) {
                //    if (i < self.MACD.length) {
                //        var itm = self.MACD[i];
                //        if (i > 0) {
                //            self.画布上下文.strokeStyle = "#ffffff";
                //            var DIFF起x = kd * (i - 1) + self.左边距 + self.左线边距;
                //            var DIFF起y = self.K线区高度 + self.量区高度 + self.MACD区间隔+ (macd数据.最大值 - self.MACD[i - 1].DIFF) * MACD高度价格比列;
                //            var DIFF始x = kd * i + self.左边距 + self.左线边距;
                //            var DIFF始y = self.K线区高度 + self.量区高度 + self.MACD区间隔 + (macd数据.最大值 - self.MACD[i].DIFF) * MACD高度价格比列;
                //            self.画布上下文.beginPath();
                //            self.画布上下文.moveTo(DIFF起x, DIFF起y);
                //            self.画布上下文.lineTo(DIFF始x, DIFF始y);
                //            self.画布上下文.stroke();
                //            self.画布上下文.save();


                //            self.画布上下文.strokeStyle = "#ffd800";
                //            var DEA起x = kd * (i - 1) + self.左边距 + self.左线边距;
                //            var DEA起y = self.K线区高度 + self.量区高度 + self.MACD区间隔 + (macd数据.最大值 - self.MACD[i - 1].DEA) * MACD高度价格比列;
                //            var DEA始x = kd * (i - 1) + self.左边距 + self.左线边距;
                //            var DEA始y = self.K线区高度 + self.量区高度 + self.MACD区间隔 + (macd数据.最大值 - self.MACD[i].DEA) * MACD高度价格比列;
                //            self.画布上下文.beginPath();
                //            self.画布上下文.moveTo(DEA起x, DEA起y);
                //            self.画布上下文.lineTo(DEA始x, DEA始y);
                //            self.画布上下文.stroke();
                //            self.画布上下文.save();



                //            var bar颜色 = itm.BAR >= 0 ? "#ff0000" : "#4523453";
                //            var barx = i * kd + self.左边距 + self.左线边距;
                //            var barY;
                //            if (itm.BAR > 0) {
                //                barY = self.K线区高度 + self.量区高度 + self.MACD区间隔 + (macd数据.BAR最大值 - itm.BAR) * BAR高度价格比列;
                //                var 高 = Math.abs(itm.BAR) * BAR高度价格比列;
                //                self.画布上下文.fillStyle = bar颜色;
                //                self.画布上下文.beginPath();
                //                self.画布上下文.fillRect(barx, barY, ww, 高);
                //                self.画布上下文.stroke();
                //                self.画布上下文.save();
                //            } else {
                //                barY= self.K线区高度 + self.量区高度 + self.MACD区间隔 + (macd数据.BAR最大值 - itm.BAR) * BAR高度价格比列 + self.MACD区高度/2;
                //                var 高 = Math.abs(itm.BAR) * BAR高度价格比列;
                //                self.画布上下文.fillStyle = bar颜色;
                //                self.画布上下文.beginPath();
                //                self.画布上下文.fillRect(barx, self.K线区高度 + self.量区高度 + self.MACD区间隔 + self.MACD区高度 / 2, self.k线柱宽度, 高);
                //                self.画布上下文.stroke();
                //                self.画布上下文.save();
                //            }
                //        }
                //    }



                //}


            };


            //////////////////////////////////////////////////////////////////////////////////
            var c1 = "", c2 = "";
            if (self.类型 == "分时") {
                c1 = "#307208";
                c2 = "#e92e10";
            } else {
                c1 = self.分时刻度文字颜色;
                c2 = self.分时刻度文字颜色;
            };

            self.画布上下文.strokeStyle = self.分时刻度颜色;
            self.画布上下文.beginPath();
            self.画布上下文.moveTo(self.左边距 + self.左线边距, self.上边距);
            self.画布上下文.lineTo(self.K线区宽度 - self.右边距, self.上边距);
            self.画布上下文.stroke();
            self.画布上下文.save();
            self.画布上下文.fillStyle = c1;
            self.画布上下文.fillText(self.计算数据.最大值.toFixed(2), self.左边距, self.上边距 + 15);
            self.画布上下文.save();

            //////////////////////////////////////////////////////////////////////////////////
            self.画布上下文.strokeStyle = self.分时刻度颜色;
            self.画布上下文.moveTo(self.左边距 + self.左线边距, self.K线区高度 - self.底边距);
            self.画布上下文.lineTo(self.K线区宽度 - self.右边距, self.K线区高度 - self.底边距);
            self.画布上下文.stroke();
            self.画布上下文.save();
            self.画布上下文.fillStyle = c2;
            self.画布上下文.fillText(self.计算数据.最小值.toFixed(2), self.左边距, (self.K线区高度 - self.底边距));
            self.画布上下文.save();
            //////////////////////////////////////////////////////////////////////////////////
            if (self.类型 != "分时") {
                kd = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / self.K线显示柱条数;
                self.画布上下文.font = "15px sans-serif";
                self.量高度价格比列 = (self.量区高度 - self.量区间隔) / Math.abs(self.计算数据.量最大值 - self.计算数据.量最小值);
                var 平均高度 = (self.K线区高度 - self.上边距 - self.底边距) / 8;
                //self.画布上下文.fillStyle = self.分时刻度文字颜色;
                var j = 0;
                for (var i = 0; i < 8; i++) {
                    if (i < 4) {
                        self.画布上下文.fillStyle = "#307208";

                    } else {
                        self.画布上下文.fillStyle = "#e92e10";
                    }
                    if (i > 0 && i < 8) {
                        if ((i % 2) > 0) {
                            var y坐标 = parseInt(平均高度.toFixed(0)) * i + 0.5 + self.上边距;

                            self.画布上下文.fillText((self.计算数据.最大值 - 平均高度 / self.高度价格比列 * i).toFixed(2), self.左边距, y坐标 + 6);
                            self.画布上下文.save();
                            self.画布上下文.strokeStyle = self.分时刻度颜色;
                            self.画布上下文.beginPath();
                            self.画布上下文.moveTo(self.左边距 + self.左线边距, y坐标);
                            self.画布上下文.lineTo(self.K线区宽度 - self.右边距, y坐标);
                            self.画布上下文.stroke();
                            self.画布上下文.save();
                        }

                    }
                };

                for (var i = 0; i < self.新数组.length; i++) {
                    var itm = self.新数组[i];
                    var c = Math.floor(self.新数组.length / 3);
                    self.画布上下文.fillStyle = self.分时刻度文字颜色;
                    self.画布上下文.strokeStyle = self.分时刻度颜色;
                    if (i == 0) {
                        var x = i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距;
                        var xxx = i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距;
                        self.画布上下文.fillText(self.time4(itm.时间), x, self.K线区高度);
                        self.画布上下文.save();
                        self.画布上下文.beginPath();
                        self.画布上下文.moveTo(xxx, self.上边距);
                        self.画布上下文.lineTo(xxx, self.K线区高度 - self.底边距);
                        self.画布上下文.stroke();
                        self.画布上下文.save();
                    };



                    if (i == (self.新数组.length - 1)) {
                        var x = self.K线区宽度 - self.右边距 - 80;
                        var xxx = self.K线区宽度 - self.右边距;
                        self.画布上下文.fillText(self.time4(itm.时间), x, self.K线区高度);
                        self.画布上下文.save();
                        self.画布上下文.beginPath();
                        self.画布上下文.moveTo(xxx, self.上边距);
                        self.画布上下文.lineTo(xxx, self.K线区高度 - self.底边距);
                        self.画布上下文.stroke();
                        self.画布上下文.save();
                    };

                    if (i % c == 0 && i > 0 && i < (self.新数组.length - 1)) {
                        var x = (i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距) - 40;
                        var xxx = i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距;
                        self.画布上下文.fillText(self.time4(itm.时间), x, self.K线区高度);
                        self.画布上下文.save();
                        self.画布上下文.beginPath();
                        self.画布上下文.moveTo(xxx, self.上边距);
                        self.画布上下文.lineTo(xxx, self.K线区高度 - self.底边距);
                        self.画布上下文.stroke();
                        self.画布上下文.save();

                    };

                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
                    var k线柱颜色 = itm.开盘 > itm.收盘 ? self.K柱阴颜色 : (itm.开盘 == itm.收盘 ? self.K柱阴颜色 : self.K柱阳颜色);
                    var k线柱高度 = 0.5;
                    var bb = Math.abs(itm.开盘 - itm.收盘) * self.高度价格比列;
                    if (bb > 0) {
                        k线柱高度 = bb;
                    };
                    var k线柱X = i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距;
                    var k线柱Y = ((self.计算数据.最大值 - (Math.max(itm.开盘, itm.收盘))) * self.高度价格比列) + self.上边距;
                    if (k线柱X + self.k线柱宽度 <= self.K线区宽度 - self.右边距) {
                        self.画布上下文.beginPath();
                        self.画布上下文.fillStyle = k线柱颜色;
                        self.画布上下文.fillRect(k线柱X, k线柱Y, self.k线柱宽度, k线柱高度);
                        self.画布上下文.stroke();
                        self.画布上下文.save();

                        var k线中心线高度 = Math.abs(itm.最高 - itm.最低) * self.高度价格比列;
                        var k线中心线X = k线柱X + Math.floor(self.k线柱宽度 / 2) + 0.5;
                        var k线中心线Y = (self.计算数据.最大值 - itm.最高) * self.高度价格比列 + self.上边距;
                        self.画布上下文.beginPath();
                        self.画布上下文.strokeStyle = k线柱颜色;
                        self.画布上下文.moveTo(k线中心线X, k线中心线Y);
                        self.画布上下文.lineTo(k线中心线X, k线中心线Y + k线中心线高度);
                        self.画布上下文.stroke();
                        self.画布上下文.save();
                    };

                    var 量柱高度 = self.新数组[i].量 * self.量高度价格比列;
                    var 量柱X = i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距;
                    var 量柱Y = self.K线区高度 + self.量区间隔 + (self.计算数据.量最大值 - self.新数组[i].量) * self.量高度价格比列;
                    var 颜色 = itm.开盘 > itm.收盘 ? self.K柱阴颜色 : (itm.开盘 == itm.收盘 ? self.K柱阴颜色 : self.K柱阳颜色);
                    self.画布上下文.strokeStyle = 颜色;
                    self.画布上下文.beginPath();
                    self.画布上下文.fillRect(量柱X, 量柱Y, self.k线柱宽度 - 1, 量柱高度);
                    self.画布上下文.stroke();
                    self.画布上下文.save();

                    //if (i == 0) {
                    //    var macdiem = {
                    //        EMA12: 0,
                    //        EMA26: 0,
                    //        DIFF: 0,
                    //        DEA: 0,
                    //        BAR: 0,
                    //        收盘价: self.新数组[i].收盘
                    //    };
                    //    self.MACD.push(macdiem);
                    //} else {
                    //    var EMA12 = self.MACD[i - 1].EMA12 * 11 / 13 + self.新数组[i].收盘 * 2 / 13
                    //    var EMA26 = self.MACD[i - 1].EMA12 * 25 / 27 + self.新数组[i].收盘 * 2 / 27;
                    //    var DIFF = EMA12 - EMA26;
                    //    var DEA = self.MACD[i - 1].DEA * 8 / 10 + DIFF * 2 / 10;
                    //    var macdiem = {
                    //        EMA12: EMA12,
                    //        EMA26: EMA26,
                    //        DIFF: DIFF,
                    //        DEA: DEA,
                    //        BAR: 2 * (DIFF - DEA),
                    //        收盘价: self.新数组[i].收盘
                    //    };
                    //    self.MACD.push(macdiem);
                    //}

                    self.M5.push(self.qingjingzhi(收盘价, i, 5));
                    self.M10.push(self.qingjingzhi(收盘价, i, 10));
                    self.M15.push(self.qingjingzhi(收盘价, i, 15));

                };




                self.画布上下文.strokeStyle = self.M5颜色;
                for (var i = 0; i < self.M5.length; i++) {
                    if (i > 0) {
                        var M5起x = kd * (i - 1) + self.左边距 + self.左线边距;
                        var M5起y = ((self.计算数据.最大值 - self.M5[i - 1]) * self.高度价格比列) + self.上边距;
                        var M5始x = kd * i + self.左边距 + self.左线边距;
                        var M5始y = ((self.计算数据.最大值 - self.M5[i]) * self.高度价格比列) + self.上边距;
                        self.画布上下文.beginPath();
                        self.画布上下文.moveTo(M5起x, M5起y);
                        self.画布上下文.lineTo(M5始x, M5始y);
                        self.画布上下文.stroke();
                        self.画布上下文.save();
                    }
                };
                self.画布上下文.strokeStyle = self.M10颜色;
                for (var i = 0; i < self.M10.length; i++) {
                    if (i > 0) {
                        var M5起x = kd * (i - 1) + self.左边距 + self.左线边距;
                        var M5起y = ((self.计算数据.最大值 - self.M10[i - 1]) * self.高度价格比列) + self.上边距;
                        var M5始x = kd * i + self.左边距 + self.左线边距;
                        var M5始y = ((self.计算数据.最大值 - self.M10[i]) * self.高度价格比列) + self.上边距;
                        self.画布上下文.beginPath();
                        self.画布上下文.moveTo(M5起x, M5起y);
                        self.画布上下文.lineTo(M5始x, M5始y);
                        self.画布上下文.stroke();
                        self.画布上下文.save();
                    }
                };
                self.画布上下文.strokeStyle = self.M15颜色;
                for (var i = 0; i < self.M15.length; i++) {
                    if (i > 0) {
                        var M5起x = kd * (i - 1) + self.左边距 + self.左线边距;
                        var M5起y = ((self.计算数据.最大值 - self.M15[i - 1]) * self.高度价格比列) + self.上边距;
                        var M5始x = kd * i + self.左边距 + self.左线边距;
                        var M5始y = ((self.计算数据.最大值 - self.M15[i]) * self.高度价格比列) + self.上边距;
                        self.画布上下文.beginPath();
                        self.画布上下文.moveTo(M5起x, M5起y);
                        self.画布上下文.lineTo(M5始x, M5始y);
                        self.画布上下文.stroke();
                        self.画布上下文.save();
                    }
                }

                self.画布上下文.fillStyle = '#fff';
                self.画布上下文.font = "80px sans-serif";
                self.画布上下文.fillText(self.市价, self.左边距 + self.左线边距 + 20, 150);


            }

            ///////////////////////////////////////////////////////////////////////////////
        }
    },
    shizhi: function (x, y) {
        var self = this;
        self.kuanjia();
        var xx, yy;
        xx = x;
        yy = y;
        if (y < self.上边距) {
            yy = self.上边距;
        };
        if (y > self.K线区高度 - self.底边距) {
            yy = self.K线区高度 - self.底边距;
        };
        if (x < self.左边距 + self.左线边距) {
            xx = self.左边距 + self.左线边距
        };
        if (x > self.K线区宽度 - self.右边距) {
            xx = self.K线区宽度 - self.右边距
        };
        self.画布上下文.font = "15px sans-serif";
        self.画布上下文.save();
        self.画布上下文.beginPath();
        self.画布上下文.strokeStyle = self.十字线颜色;
        self.画布上下文.moveTo(self.左边距 + self.左线边距, yy);
        self.画布上下文.lineTo(self.K线区宽度 - self.右边距, yy);
        self.画布上下文.moveTo(xx, self.上边距);
        self.画布上下文.lineTo(xx, self.画布高度);
        self.画布上下文.stroke();
        self.画布上下文.restore();

        self.画布上下文.fillStyle = self.显示文本颜色;
        var z = (self.计算数据.最大值 - ((y - self.上边距) / self.高度价格比列)).toFixed(2);
        self.画布上下文.fillText(z, self.左边距 + self.左线边距 + 10, yy);
        self.画布上下文.save();

        if (self.类型 == "分时") {

            var ww = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / 555;
            var 数据索引 = Math.floor((x - self.左边距 - self.左线边距) / ww);
            数据索引 = 数据索引 < 0 ? 0 : 数据索引;


            self.画布上下文.fillText("市:" + self.分时数据.length <= 0 || 数据索引 >= self.分时数据.length ? "-" : "市价:" + self.分时数据[数据索引].收盘, self.左边距 + self.左线边距, self.K线区高度 + 30);
            self.画布上下文.fillText("量:" + self.分时数据.length <= 0 || 数据索引 >= self.分时数据.length ? "-" : "量:" + self.分时数据[数据索引].量, self.左边距 + self.左线边距 + 100, self.K线区高度 + 30);
            self.画布上下文.fillText("均:" + self.分时数据.length <= 0 || 数据索引 >= self.分时数据.length ? "-" : "均:" + self.均线[数据索引].toFixed(2), self.左边距 + self.左线边距 + 200, self.K线区高度 + 30);
            self.画布上下文.fillText("时:" + self.分时数据.length <= 0 || 数据索引 >= self.分时数据.length ? "-" : "时:" + self.分时数据[数据索引].时间, self.左边距 + self.左线边距 + 300, self.K线区高度 + 30);
        } else {

            var kd = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / self.新数组.length;
            var 数据索引 = Math.floor((x - self.左边距 - self.左线边距) / kd);
            数据索引 = 数据索引 < 0 ? 0 : 数据索引;
            self.画布上下文.fillStyle = self.显示文本颜色;
            self.画布上下文.fillText("开:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "开:" + self.新数组[数据索引].开盘, self.左边距 + self.左线边距, self.K线区高度 + 30);
            self.画布上下文.fillText("高:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "高:" + self.新数组[数据索引].最高, self.左边距 + self.左线边距 + 100, self.K线区高度 + 30);
            self.画布上下文.fillText("低:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "低:" + self.新数组[数据索引].最低, self.左边距 + self.左线边距 + 200, self.K线区高度 + 30);
            self.画布上下文.fillText("收:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "收:" + self.新数组[数据索引].最低, self.左边距 + self.左线边距 + 300, self.K线区高度 + 30);
            self.画布上下文.fillText("量:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "量:" + self.新数组[数据索引].量, self.左边距 + self.左线边距 + 400, self.K线区高度 + 30);
            self.画布上下文.fillText("时:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "时:" + self.time4(self.新数组[数据索引].时间), self.左边距 + self.左线边距 + 500, self.K线区高度 + 30);

            self.画布上下文.fillStyle = self.M5颜色;
            self.画布上下文.fillText(self.M5[数据索引], self.左边距 + self.左线边距 + 45, 30);
            self.画布上下文.fillStyle = self.M10颜色;
            self.画布上下文.fillText(self.M10[数据索引], self.左边距 + self.左线边距 + 150 + 55, 30);
            self.画布上下文.fillStyle = self.M15颜色;
            self.画布上下文.fillText(self.M15[数据索引], self.左边距 + self.左线边距 + 300 + 55, 30);
            self.画布上下文.save();
        }

    },
    eve: function () {
        var self = this;
        var klineHammer = new Hammer.Manager(document.getElementById("canvas1"));
        var pan = new Hammer.Pan();
        var pinch = new Hammer.Pinch();
        var press = new Hammer.Press();
        klineHammer.add([pan, pinch, press]);

        klineHammer.on("panstart", function (e) {
            self.拖动开始x = e.changedPointers[0].pageX * 2;
        });

        klineHammer.on("panright", function (e) {
            self.拖动结束x = e.changedPointers[0].pageX * 2;
            if (self.十字线显示) {
                var y = e.changedPointers[0].pageY;
                self.shizhi(e.changedPointers[0].pageX * 2, y * 2);
            } else {
                var 拖动距离 = Math.abs(self.拖动结束x - self.拖动开始x);
                var 拖动条数 = Math.floor((拖动距离 / (self.k线柱宽度 + self.k线柱间隔)) * 0.5);
                self.开始条数 = (self.开始条数 - 拖动条数) < 0 ? 0 : (self.开始条数 - 拖动条数);
                self.结束条数 = (self.结束条数 - 拖动条数) < self.K线显示柱条数 ? self.结束条数 : (self.结束条数 - 拖动条数);
                self.jishuan();
            }
        });
        klineHammer.on("panleft", function (e) {
            self.拖动结束x = e.changedPointers[0].pageX * 2;
            if (self.十字线显示) {
                var y = e.changedPointers[0].pageY;
                self.shizhi(e.changedPointers[0].pageX * 2, y * 2);
            } else {
                var 拖动距离 = Math.abs(self.拖动结束x - self.拖动开始x);
                var 拖动条数 = Math.floor((拖动距离 / (self.k线柱宽度 + self.k线柱间隔)) * 0.5);
                self.开始条数 = (self.开始条数 + 拖动条数) > self.分时数据.length - self.K线显示柱条数 ? self.分时数据.length - self.K线显示柱条数 : (self.开始条数 + 拖动条数);
                self.结束条数 = (self.结束条数 + 拖动条数) > self.分时数据.length ? self.分时数据.length : (self.结束条数 + 拖动条数);
                self.jishuan();
            }

        });
        klineHammer.on("panup", function (e) {
            self.十字线显示 = true;
            var y = e.changedPointers[0].pageY;
            self.shizhi(e.changedPointers[0].pageX * 2, y * 2);
        });

        klineHammer.on("pandown", function (e) {
            self.十字线显示 = true;
            var y = e.changedPointers[0].pageY;
            self.shizhi(e.changedPointers[0].pageX * 2, y * 2);
        });
        klineHammer.on("press", function (e) {
            self.十字线显示 = true;
            var y = e.changedPointers[0].pageY;
            self.shizhi(e.changedPointers[0].pageX * 2, y * 2);
        });
        klineHammer.on("pressup", function () {
            self.十字线显示 = false;
            self.kuanjia();
        });

        klineHammer.on("panend", function () {
            self.十字线显示 = false;
            self.kuanjia();
        });
        klineHammer.on("pinchstart", function (e) {
            self.放大 = true;
        });
        klineHammer.on("pinchend", function (e) {
            self.放大 = false;
        });
        klineHammer.on("pinchin", function (e) {
            self.K线显示柱条数 = self.K线显示柱条数 + Math.floor(2 / e.scale);
            if (self.K线显示柱条数 > self.分时数据.length) {
                self.K线显示柱条数 = self.分时数据.length;
            };
            self.jishuan();
        });

        klineHammer.on("pinchout", function (e) {
            self.K线显示柱条数 = self.K线显示柱条数 - Math.floor(1.9 * e.scale);
            if (self.K线显示柱条数 < 1) {
                self.K线显示柱条数 = 1;
            };
            self.jishuan();
        });
    },
    getlendata: function (data) {
        var self = this;

        var 输出数组 = {};
        var 最大值 = 0, 最小值 = 1000000, 收盘价最大值 = 0, 收盘价最小值 = 1000000;
        data.forEach(function (itm) {
            if (itm.开盘 > 最大值) 最大值 = itm.开盘;
            if (itm.开盘 < 最小值) 最小值 = itm.开盘;

            if (itm.收盘 > 最大值) 最大值 = itm.收盘;
            if (itm.收盘 < 最小值) 最小值 = itm.收盘;

            if (itm.最高 > 最大值) 最大值 = itm.最高;
            if (itm.最高 < 最小值) 最小值 = itm.最高;

            if (itm.最低 > 最大值) 最大值 = itm.最低;
            if (itm.最低 < 最小值) 最小值 = itm.最低;
        });


        if (self.类型 == "分时") {
            var a = 最大值;
            var b = 最小值;
            var i = Math.abs(b - self.昨收) * 0.8;
            var k = Math.abs(a - self.昨收) * 0.8;
            var zd = 0;
            if (i > k) {
                zd = i;
            } else {
                zd = k;
            };
            if (self.第一次加载数据 == false) {
                if ((a - b) == 0) {
                    输出数组.最大值 = (self.昨收 + 1);
                    输出数组.最小值 = (self.昨收 - 1);
                } else {
                    输出数组.最大值 = (self.昨收 + (zd * 2));
                    输出数组.最小值 = (self.昨收 - (zd * 2));
                };
            } else {
                if (最大值 > self.计算数据.最大值 || 最小值 < self.计算数据.最小值) {
                    if ((a - b) == 0) {
                        输出数组.最大值 = (self.昨收 + 1);
                        输出数组.最小值 = (self.昨收 - 1);
                    } else {
                        输出数组.最大值 = (self.昨收 + (zd * 2));
                        输出数组.最小值 = (self.昨收 - (zd * 2));
                    };
                } else {
                    输出数组.最大值 = self.计算数据.最大值;
                    输出数组.最小值 = self.计算数据.最小值;
                }
            }

            输出数组.量最大值 = Enumerable.From(data).Max(function (i) { return i.量; });
            输出数组.量最小值 = Enumerable.From(data).Min(function (i) { return i.量; });
            return 输出数组;
        } else {
            if (self.第一次加载数据 == false) {
                输出数组.最大值 = 最大值;
                输出数组.最小值 = 最小值;
            } else {
                //if (最大值 > self.计算数据.最大值 || 最小值 < self.计算数据.最小值) {
                //    输出数组.最大值 = 最大值;
                //    输出数组.最小值 = 最小值;
                //} else {
                //    输出数组.最大值 = self.计算数据.最大值;
                //    输出数组.最小值 = self.计算数据.最小值;
                //}
                     输出数组.最大值 = 最大值;
                    输出数组.最小值 = 最小值;
            }
            输出数组.量最大值 = Enumerable.From(data).Max(function (i) { return i.量; });
            输出数组.量最小值 = Enumerable.From(data).Min(function (i) { return i.量; });
            return 输出数组;
        }

    },
    MACDlen: function (data) {
        var MACD最大值 = 0, MACD最小值 = 1000000, BAR最大值 = 0, BAR最小值 = 1000000;
        data.forEach(function (itm) {
            if (itm.DIFF > MACD最大值) MACD最大值 = itm.DIFF;
            if (itm.DIFF < MACD最小值) MACD最小值 = itm.DIFF;

            if (itm.DEA > MACD最大值) MACD最大值 = itm.DEA;
            if (itm.DEA < MACD最小值) MACD最小值 = itm.DEA;

            if (Math.abs(itm.BAR) > BAR最大值) BAR最大值 = Math.abs(itm.BAR);
            if (itm.BAR < BAR最小值) BAR最小值 = itm.BAR;
        })

        var 输出数组 = {};
        输出数组.最大值 = MACD最大值;
        输出数组.最小值 = MACD最小值;
        输出数组.BAR最大值 = BAR最大值;
        输出数组.BAR最小值 = BAR最小值;
        return 输出数组;
    }
    ,
    time1: function (n) {
        try {
            var self = this;
            var newtime = "";
            var xz = new Date();
            var da = xz.getFullYear() + '/' + (xz.getMonth() + 1) + '/' + xz.getDate();
            var ks = new Date(da + " 09:00");
            var zw = new Date(da + " 11:30");
            var xw = new Date(da + " 13:30");

            if (n <= 75) {
                newtime = new Date(ks.getTime() + 1000 * 60 * n);
            } else if (n > 75 && n < 135) {
                newtime = new Date(ks.getTime() + 1000 * 60 * n + 1000 * 60 * (15 - 1));
            } else if (n == 135) {
                newtime = new Date(ks.getTime() + 1000 * 60 * n + 1000 * 60 * (15));
            } else if (n > 135 && n < 225) {
                newtime = new Date(ks.getTime() + 1000 * 60 * n + 1000 * 60 * 15 + 1000 * 60 * (120 - 1));
            } else if (n == 225) {
                newtime = new Date(ks.getTime() + 1000 * 60 * n + 1000 * 60 * 15 + 1000 * 60 * (120));
            }
            else if (n > 225 & n < 555) {
                newtime = new Date(ks.getTime() + 1000 * 60 * n + 1000 * 60 * 15 + 1000 * 60 * 120 + 1000 * 60 * (360 - 1));
            } else if (n == 555) {

                newtime = new Date(ks.getTime() + 1000 * 60 * n + 1000 * 60 * 15 + 1000 * 60 * 120 + 1000 * 60 * (360));
            }
            return newtime.getHours() + ":" + newtime.getMinutes();
        }
        catch (err) {
            return "-";
        }

    },
    time2: function (n) {
        return n.substring(n.length - 5, n.length);
    },
    junjia: function (sz, index) {
        var avg = 0;
        var sum = 0;
        for (var i = 0; i < index; i++) {
            sum += sz[i];
        };
        avg = sum / index;
        return avg;
    },
    qingjingzhi: function (sz, index, val) {
        var avg = 0;
        var sum = 0;
        var start = index < val ? 0 : (index - (val - 1));
        var end = index + 1;
        for (var i = start; i < end; i++) {
            sum += sz[i];
        };
        avg = sum / (index < val ? index + 1 : val);
        return avg.toFixed(4);
    },
    time3: function (t) {
        t = t.replace(/\-/g, "/");
        var d = new Date(t);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        s = year + '-' + mon + "-" + day + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        return s;
    },
    time4: function (t) {
        t = t.replace(/\-/g, "/");
        var d = new Date(t);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        s = mon + "/" + day + " " + d.getHours() + ":" + d.getMinutes();
        return s;
    }

}
