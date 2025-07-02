import React from 'react';
import { View } from 'react-native';
import Svg, { Line, Circle, Text } from 'react-native-svg';

const Speedometer = ({ value = 35, size = 250, min = 0, max = 100 }) => {
  const center = size / 2;
  const radius = center - 10;
  const needleLength = radius - 25;

  // Convert value to angle (in degrees)
  const angle = ((value - min) / (max - min)) * 180 + 180;
  const rad = (angle * Math.PI) / 180;

  const needleX = center + needleLength * Math.cos(rad);
  const needleY = center + needleLength * Math.sin(rad);

  const majorTicks = Array.from({ length: 11 }, (_, i) => i * 10); // 0 to 100
  const minorTicks = Array.from({ length: 51 }, (_, i) => i * 2);  // 0 to 100, every 2 units

  return (
    <View>
      <Svg width={size} height={size}>
        {/* Minor ticks */}
        {minorTicks.map((tick, i) => {
          const tickAngle = (tick / 100) * 180 + 180;
          const tickRad = (tickAngle * Math.PI) / 180;
          const x1 = center + (radius - 5) * Math.cos(tickRad);
          const y1 = center + (radius - 5) * Math.sin(tickRad);
          const x2 = center + radius * Math.cos(tickRad);
          const y2 = center + radius * Math.sin(tickRad);

          return (
            <Line key={`minor-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth={1} />
          );
        })}

        {/* Major ticks & Labels */}
        {majorTicks.map((tick, i) => {
          const tickAngle = (tick / 100) * 180 + 180;
          const tickRad = (tickAngle * Math.PI) / 180;

          const x1 = center + (radius - 10) * Math.cos(tickRad);
          const y1 = center + (radius - 10) * Math.sin(tickRad);
          const x2 = center + radius * Math.cos(tickRad);
          const y2 = center + radius * Math.sin(tickRad);

          const labelX = center + (radius - 25) * Math.cos(tickRad);
          const labelY = center + (radius - 25) * Math.sin(tickRad);

          return (
            <React.Fragment key={`major-${i}`}>
              <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth={2} />
              <Text
                x={labelX}
                y={labelY}
                fill="black"
                fontSize="12"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {tick}
              </Text>
            </React.Fragment>
          );
        })}

        {/* Centered Labels Behind Needle */}
        <Text
          x={center}
          y={center - 20}
          fill="black"
          fontSize="20"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          KMPH
        </Text>
        <Text
          x={center}
          y={center + 20}
          fill="black"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          VECHILE SPEED
        </Text>

        {/* Needle */}
        <Line
          x1={center}
          y1={center}
          x2={needleX}
          y2={needleY}
          stroke="steelblue"
          strokeWidth={6}
        />

        {/* Center Circle */}
        <Circle cx={center} cy={center} r={8} fill="steelblue" />
      </Svg>
    </View>
  );
};

export default Speedometer;
