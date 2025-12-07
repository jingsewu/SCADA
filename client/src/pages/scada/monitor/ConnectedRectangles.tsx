import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import request from "@/utils/requestInterceptor"
import { useSSR } from "react-i18next"

const ConnectedRectangles: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null)

    const [socket, setSocket] = useState<any>(null)
    const [allConveyorData, setAllConveyorData] = useState<any>() // findall获取的输送线nodes数据

    const getAllConveyorData = async () => {
        const response: any = await request({
            url: "/mdm/conveyor/findAll",
            method: "get"
        })
        // console.log("response", response.data)
        setAllConveyorData(response?.data)
    }

    const handleOepnMock = async () => {
        const response: any = await request({
            url: "/mdm/conveyor/openMock",
            method: "get"
        })
        console.log("response", response)
    }

    const getWebsocketData = () => {
        if ("WebSocket" in window) {
            let ws = new WebSocket("ws://117.50.245.4:9020/scada/ws")
            ws.onopen = function () {
                console.log("WebSocket连接成功")
            }
            ws.onmessage = function (event) {
                if (event && event.data) {
                    const data = JSON.parse(event.data)
                    console.log("websocketdata", data)
                    handleSvgData(data.nodes)
                }
            }
            ws.onerror = function (err) {
                console.log("WebSocket error")
            }
            ws.onclose = function (err) {
                console.log("WebSocket close")
            }

            setSocket(ws)
        } else {
            alert("当前浏览器不支持websocket协议,建议使用现代浏览器")
        }
    }

    useEffect(() => {
        const initData = async () => {
            try {
                await getAllConveyorData()
                getWebsocketData()
            } catch (error) {
                console.log("error", error)
            }
        }
        initData()
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close()
            }
        }
    }, [])

    useEffect(() => {
        if (!allConveyorData) return
        allConveyorData.map((item: any) => {
            handleSvgData(item.nodes)
        })
    }, [allConveyorData])

    const handleSvgData = (nodes: any[]) => {
        if (!svgRef.current) return

        // Clear any existing content
        d3.select(svgRef.current).selectAll("*").remove()

        // SVG dimensions

        const rectWidth = 20 // 绿色矩形宽度
        const rectHeight = 30 // 绿色矩形高度
        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr("width", "100%")
            .attr("height", "100%")

        // Generate data points for the horizontal line
        const numRectangles = 60 // 矩形个数
        // const points = Array.from({ length: numRectangles }, (_, i) => ({
        //     x: rectWidth * (i + 1),
        //     y: rectHeight,
        //     width: rectWidth,
        //     height: rectHeight
        // }))

        const angle90Rects = nodes.filter((item) => item.angle === 90)
        const angle270Rects = nodes.filter((item) => item.angle === 270)
        const angle0Rects = nodes.filter((item) => item.angle === 0)

        // const points = nodes.map((item, i) => ({
        //     ...item,
        //     x:
        //         200 +
        //         (item.angle === 90 || item.angle === 270
        //             ? rectWidth - rectWidth / 2
        //             : rectWidth * (i + 1) - rectWidth / 2),
        //     y:
        //         200 +
        //         (item.angle === 90 || item.angle === 270
        //             ? rectHeight * (i + 1) - rectHeight
        //             : rectHeight - rectHeight / 2),
        //     width: rectWidth,
        //     height: rectHeight
        // }))

        const points = nodes.map((item, i) => {
            if (item.angle === 90) {
                return {
                    ...item,
                    x: 200 + rectWidth - rectWidth / 2,
                    y: 200 + rectHeight * (i - 1) - rectHeight / 2,
                    width: rectWidth,
                    height: rectHeight
                }
            } else if (item.angle === 0) {
                return {
                    ...item,
                    x:
                        200 +
                        rectWidth * (i - angle90Rects.length + 1) -
                        rectWidth / 2,
                    y:
                        200 +
                        rectHeight * (angle90Rects.length - 1) -
                        rectHeight / 2,
                    width: rectWidth,
                    height: rectHeight
                }
            } else if (item.angle === 270) {
                return {
                    ...item,
                    x: 200 + rectWidth * angle0Rects.length - rectWidth / 2,
                    y:
                        200 +
                        rectHeight * angle90Rects.length -
                        rectHeight *
                            (i - angle90Rects.length - angle0Rects.length + 2) -
                        rectHeight / 2,
                    width: rectWidth,
                    height: rectHeight
                }
            }
        })
        // const verticalPoints = Array.from({ length: 30 }, (_, i) => ({
        //     x: rectWidth * numRectangles + 60 - rectWidth / 2,
        //     y: rectWidth * i + rectHeight + 60,
        //     // y: 0,
        //     width: rectHeight,
        //     height: rectWidth
        // }))
        console.log("points", points)
        const rectGroups = svg
            .selectAll(".rect-group")
            .data(points)
            .enter()
            .append("g")
            .attr("class", "rect-group")
            .attr("transform", (d, i) => `translate(${d.x}, ${d.y})`)
        console.log("rectGroups", rectGroups)
        // 绘制外层矩形
        rectGroups
            .append("rect")
            .attr("class", "outer-rect")
            .attr("width", (d) => d.width)
            .attr("height", (d) => d.height)
            // .attr("y", 0)
            // .attr("transform", (d) => `rotate(${d.angle})`)
            .attr("fill", "#b7eb8f")
            .attr("stroke", "#73d13d")
            .attr("stroke-width", 1)

        // 为hasbox为true的数据添加内层矩形
        rectGroups
            .filter((d) => d.hasBox)
            .append("rect")
            .attr("class", "inner-rect")
            .attr("width", (d) => d.width)
            .attr("height", (d) => d.height)
            // .attr("y", 0)
            // .attr("x", (d) => d.x - rectWidth)
            // .attr("y", (d) => d.y - rectHeight / 2)
            .attr("fill", "#4F46E5")
            // .attr("rx", 4) // Rounded corners
            .attr("stroke", "#73d13d")
            .attr("stroke-width", 1)

        // Create arc generator
        const arc = d3
            .arc()
            .innerRadius(30)
            .outerRadius(60)
            .startAngle(0)
            .endAngle(Math.PI * 0.5) // 90 degrees

        // Create rectangles
        // svg.selectAll("rect")
        //     .data(points)
        //     .enter()
        //     .append("rect")
        //     .attr("x", (d) => d.x - rectWidth)
        //     .attr("y", (d) => d.y - rectHeight / 2)
        //     .attr("width", (d) => d.width)
        //     .attr("height", (d) => d.height)
        //     // .attr("fill", "#b7eb8f")
        //     .attr("fill", (d) => (d.hasBox ? "#4F46E5" : "#b7eb8f"))
        //     // .attr("rx", 4) // Rounded corners
        //     .attr("stroke", "#73d13d")
        //     .attr("stroke-width", 1)

        // Add the arc path
        // svg.append("path")
        //     .attr(
        //         "transform",
        //         `translate(${rectWidth * numRectangles}, ${rectHeight + 45})`
        //     )
        //     .attr("d", arc as any)
        //     .attr("fill", "#b7eb8f")
        //     .attr("stroke", "#73d13d")
        //     .attr("stroke-width", 1)
    }

    // useEffect(() => {
    //     // getAllConveyorData()
    //     // handleOepnMock()
    //     // getWebsocketData()
    //     if (!svgRef.current) return

    //     // Clear any existing content
    //     d3.select(svgRef.current).selectAll("*").remove()

    //     // SVG dimensions
    //     const width = 1000
    //     const height = 800
    //     const margin = { top: 20, right: 20, bottom: 20, left: 20 }
    //     const rectWidth = 20 // 绿色矩形宽度
    //     const rectHeight = 30 // 绿色矩形高度
    //     // Create SVG
    //     const svg = d3
    //         .select(svgRef.current)
    //         .attr("width", "100%")
    //         .attr("height", "100%")

    //     // Generate data points for the horizontal line
    //     const numRectangles = 60 // 矩形个数
    //     const points = Array.from({ length: numRectangles }, (_, i) => ({
    //         x: rectWidth * (i + 1),
    //         y: rectHeight,
    //         width: rectWidth,
    //         height: rectHeight
    //     }))
    //     const verticalPoints = Array.from({ length: 30 }, (_, i) => ({
    //         x: rectWidth * numRectangles + 60 - rectWidth / 2,
    //         y: rectWidth * i + rectHeight + 60,
    //         // y: 0,
    //         width: rectHeight,
    //         height: rectWidth
    //     }))
    //     console.log("points", points)

    //     // Create arc generator
    //     const arc = d3
    //         .arc()
    //         .innerRadius(30)
    //         .outerRadius(60)
    //         .startAngle(0)
    //         .endAngle(Math.PI * 0.5) // 90 degrees

    //     // Create rectangles
    //     svg.selectAll("rect")
    //         .data(points.concat(verticalPoints))
    //         .enter()
    //         .append("rect")
    //         .attr("x", (d) => d.x - rectWidth)
    //         .attr("y", (d) => d.y - rectHeight / 2)
    //         .attr("width", (d) => d.width)
    //         .attr("height", (d) => d.height)
    //         .attr("fill", "#b7eb8f")
    //         // .attr("rx", 4) // Rounded corners
    //         .attr("stroke", "#73d13d")
    //         .attr("stroke-width", 1)

    //     // Add the arc path
    //     svg.append("path")
    //         .attr(
    //             "transform",
    //             `translate(${rectWidth * numRectangles}, ${rectHeight + 45})`
    //         )
    //         .attr("d", arc as any)
    //         .attr("fill", "#b7eb8f")
    //         .attr("stroke", "#73d13d")
    //         .attr("stroke-width", 1)

    //     // Create a group for moving boxes
    //     const boxGroup = svg.append("g")
    //     // Box parameters
    //     const boxWidth = 20
    //     const boxHeight = 30
    //     const boxColor = "#4F46E5"
    //     const boxStroke = "#3730A3"

    //     // Animation function
    //     function createBox() {
    //         const box = boxGroup
    //             .append("rect")
    //             .attr("x", margin.left)
    //             // .attr("y", beltY - boxHeight - beltHeight / 2)
    //             .attr("y", boxHeight / 2)
    //             .attr("width", boxWidth)
    //             .attr("height", boxHeight)
    //             .attr("fill", boxColor)
    //             .attr("stroke", boxStroke)
    //             .attr("stroke-width", 2)
    //             .attr("rx", 4)

    //         // Animate the box
    //         box.transition()
    //             .duration(5000)
    //             .ease(d3.easeLinear)
    //             // .attr("x", width - margin.right - boxWidth)
    //             .attr("x", rectWidth * numRectangles)
    //             .on("end", function () {
    //                 d3.select(this).remove()
    //             })
    //     }

    //     // Create initial boxes
    //     createBox()

    //     // Create new boxes periodically
    //     const interval = setInterval(createBox, 2000)

    //     // Cleanup
    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [])

    return <svg ref={svgRef} className="bg-white rounded-lg shadow-lg" />
}

export default ConnectedRectangles
