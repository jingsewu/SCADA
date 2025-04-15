import React, { useEffect, useRef } from "react"
import * as d3 from "d3"

const ConnectedRectangles: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        if (!svgRef.current) return

        // Clear any existing content
        d3.select(svgRef.current).selectAll("*").remove()

        // SVG dimensions
        const width = 1000
        const height = 800
        const margin = { top: 20, right: 20, bottom: 20, left: 20 }
        const rectWidth = 40 // 绿色矩形宽度
        const rectHeight = 60 // 绿色矩形高度
        const verticalRectHeight = 40 // 绿色矩形高度
        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)

        // Generate data points for the horizontal line
        const numRectangles = 20 // 矩形个数
        const points = Array.from({ length: numRectangles }, (_, i) => ({
            x: rectWidth * (i + 1),
            y: rectHeight,
            width: 40,
            height: 60
        }))
        const verticalPoints = Array.from({ length: 10 }, (_, i) => ({
            x: rectWidth * numRectangles + 120 - rectWidth / 2,
            y: verticalRectHeight * i + rectHeight + 120,
            // y: 0,
            width: 60,
            height: 40
        }))
        console.log("points", points)

        // Create arc generator
        const arc = d3
            .arc()
            .innerRadius(60)
            .outerRadius(120)
            .startAngle(0)
            .endAngle(Math.PI * 0.5) // 90 degrees

        // Create rectangles
        svg.selectAll("rect")
            .data(points.concat(verticalPoints))
            .enter()
            .append("rect")
            .attr("x", (d) => d.x - rectWidth)
            .attr("y", (d) => d.y - rectHeight / 2)
            .attr("width", (d) => d.width)
            .attr("height", (d) => d.height)
            .attr("fill", "#b7eb8f")
            // .attr("rx", 4) // Rounded corners
            .attr("stroke", "#73d13d")
            .attr("stroke-width", 1)

        // Add the arc path
        svg.append("path")
            .attr("transform", `translate(${800}, ${rectHeight + 90})`)
            .attr("d", arc as any)
            .attr("fill", "#b7eb8f")
            .attr("stroke", "#73d13d")
            .attr("stroke-width", 1)

        // Create a group for moving boxes
        const boxGroup = svg.append("g")
        // Box parameters
        const boxWidth = 40
        const boxHeight = 60
        const boxColor = "#4F46E5"
        const boxStroke = "#3730A3"

        // Animation function
        function createBox() {
            const box = boxGroup
                .append("rect")
                .attr("x", margin.left)
                // .attr("y", beltY - boxHeight - beltHeight / 2)
                .attr("y", boxHeight / 2)
                .attr("width", boxWidth)
                .attr("height", boxHeight)
                .attr("fill", boxColor)
                .attr("stroke", boxStroke)
                .attr("stroke-width", 2)
                .attr("rx", 4)

            // Animate the box
            box.transition()
                .duration(5000)
                .ease(d3.easeLinear)
                // .attr("x", width - margin.right - boxWidth)
                .attr("x", rectWidth * 20)
                .on("end", function () {
                    d3.select(this).remove()
                })
        }

        // Create initial boxes
        createBox()

        // Create new boxes periodically
        const interval = setInterval(createBox, 2000)

        // Cleanup
        return () => {
            clearInterval(interval)
        }
    }, [])

    return <svg ref={svgRef} className="bg-white rounded-lg shadow-lg" />
}

export default ConnectedRectangles
