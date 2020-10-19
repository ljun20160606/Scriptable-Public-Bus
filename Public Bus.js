// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;

// fool-kit
const foolkit = importModule('foolkit')

// api of ibuscloud
const ibuscloud = importModule('ibuscloud')
// const ibuscloud = importModule('ibuscloud-mock')

async function getCurrentLocation() {
    // {
    //     "latitude": 50.990845680236816,
    //     "altitude": 50.990845680236816,
    //     "longitude": 50.990845680236816,
    //     "horizontalAccuracy": 30,
    //     "verticalAccuracy": 4
    // }
    const local = await Location.current()
    return {
        latitute: local.latitude.toFixed(6),
        longitude: local.longitude.toFixed(6)
    }
}

function parseWidgetArgs() {
    if (!args.widgetParameter) {
      return null
    }
    const splitArgs = args.widgetParameter.split(',')
    return {
        "routeId": parseInt(splitArgs[0]),
        "stopId": parseInt(splitArgs[1])
    }
}

function parseStopSummary(result) {
    console.log(result)
    const nextBuses = result.item.nextBuses
    return {
        stopName: nextBuses.stopName,
        buses: nextBuses.buses
    }
}

function createStopWidget(stopSummary) {
    const listWidget = new ListWidget()
    listWidget.setPadding(0, 10, 0, 0)

    const { stopName, buses } = stopSummary
    const stopNameEle = listWidget.addText(`${stopName} ${(new Date()).toLocaleTimeString('en-US', {hour12: false})}`)
    stopNameEle.font = Font.boldSystemFont(16)
    stopNameEle.leftAlignText()

    listWidget.addSpacer(5)

    if (buses.length === 0) {
        const emptyEle = listWidget.addText("无公交")
        emptyEle.font = new Font('Menlo', 12)
        emptyEle.leftAlignText()
        return listWidget
    }

    for (const bus of buses) {
        const busStack = listWidget.addStack()
        const busEle = busStack.addText(`${bus.busPlate} 下一站${bus.nextStation} ${bus.isArrive ? '已到达' : '未到达'}; 距离当前站还有${bus.targetStopCount}站 ${bus.targetDistance}米`)
        busEle.font = new Font('Menlo', 12)
        busEle.leftAlignText()
    }

    return listWidget
}

const newLocal = await foolkit.callback("currentLocation", async () => await getCurrentLocation())
const widgetArgs = parseWidgetArgs()

let widget;
if (!widgetArgs) {
    const listWidget = new ListWidget()
    listWidget.addText("请填写参数 routeId,stopId")
    widget = listWidget
} else if (!betweenTime(8, 23)) {
    const listWidget = new ListWidget()
    const date = new Date()
    const stopText = listWidget.addText(widgetArgs.stopId + '')
    stopText.font = Font.boldSystemFont(16)
    listWidget.addText(`当前时间${date.getHours()}点,不在8-23点之间,不获取公交信息`)
    widget = listWidget
} else {
    const result = await ibuscloud.getNextBusByRouteStopId(newLocal.latitute, newLocal.longitude, widgetArgs.stopId, widgetArgs.routeId)
    const stopSummary = parseStopSummary(result)
    widget = createStopWidget(stopSummary)
}

if (config.runsInWidget) {
    Script.setWidget(widget)
} else {
    widget.presentMedium()
}
Script.complete()

function betweenTime(beginHours, endHours) {
    const currentHours = new Date().getHours()
    return beginHours <= currentHours && currentHours <= endHours
}