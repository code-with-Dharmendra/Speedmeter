import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Path, Line, Circle, Rect, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SIZE = width * 0.8;
const RADIUS = SIZE /2;
const STROKE_WIDTH = 2;
const INNER_RADIUS = RADIUS - STROKE_WIDTH * 2 ;
const MAJOR_TICKS = [0, 20, 40, 60, 80, 100, 120];
const TOTAL_DEG = 180;

export default function Speedometer({ value = 0, max = 120 }) {
  // Animated for smooth needle
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Clock state
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    // Animate needle whenever value changes
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [value]);

  useEffect(() => {
    // Update clock every minute
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hh}:${mm}`);
    };
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);

  // Angle interpolation
  const angle = animatedValue.interpolate({
    inputRange: [0, max],
    outputRange: ['-90deg', '90deg'],
  });

  // Draw ticks
const ticks = [];
MAJOR_TICKS.forEach((t, i) => {
  const theta = Math.PI * (1 + t / max);
  // Major tick
  const x1 = RADIUS + (INNER_RADIUS - 10) * Math.cos(theta);
  const y1 = RADIUS + (INNER_RADIUS - 10) * Math.sin(theta);
  const x2 = RADIUS + INNER_RADIUS * Math.cos(theta);
  const y2 = RADIUS + INNER_RADIUS * Math.sin(theta);
  
  // Add major tick line and label
  ticks.push(
    <React.Fragment key={`major-${t}`}>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#4F9EF5"
        strokeWidth={2}
      />
      <SvgText
        x={RADIUS + (INNER_RADIUS - 25) * Math.cos(theta)}
        y={RADIUS + (INNER_RADIUS - 25) * Math.sin(theta)}
        fontSize="12"
        fill="#4F9EF5"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {t}
      </SvgText>
    </React.Fragment>
  );

  // Minor tick halfway to next major except last
  if (i < MAJOR_TICKS.length - 1) {
    const mid = (t + MAJOR_TICKS[i + 1]) / 2;
    const phi = Math.PI * (1 + mid / max);
    const mx1 = RADIUS + (INNER_RADIUS - 5) * Math.cos(phi);
    const my1 = RADIUS + (INNER_RADIUS - 5) * Math.sin(phi);
    const mx2 = RADIUS + INNER_RADIUS * Math.cos(phi);
    const my2 = RADIUS + INNER_RADIUS * Math.sin(phi);
    ticks.push(
      <Line
        key={`minor-${mid}`}
        x1={mx1}
        y1={my1}
        x2={mx2}
        y2={my2}
        stroke="#8F9EF8"
        strokeWidth={1}
      />
    );
  }
});

  // Bar indicators
  const bars = [];
  for (let i = 0; i <= max; i += 5) {
    const phi = Math.PI * (1 + i / max);
    const bx1 = RADIUS + (INNER_RADIUS - 35) * Math.cos(phi);
    const by1 = RADIUS + (INNER_RADIUS - 35) * Math.sin(phi);
    const bx2 = RADIUS + (INNER_RADIUS - 50) * Math.cos(phi);
    const by2 = RADIUS + (INNER_RADIUS - 50) * Math.sin(phi);
    bars.push(
      <Line
        key={`bar-${i}`}
        x1={bx1}
        y1={by1}
        x2={bx2}
        y2={by2}
        stroke={i <= value ? '#4F9EF5' : '#612'}
        strokeWidth={4}
      />
    );
  }

  return (
    <View style={styles.card} >
      <View style={styles.clockContainer}>
        <Text style={styles.clock}>{time}</Text>
      </View>
      <Svg width={SIZE} height={2*SIZE/3} >
        <G transform={`rotate(20, ${RADIUS}, ${RADIUS})`} >
          {/* Outer arc */}
          <Path
            d={`M ${0},${RADIUS} A ${RADIUS},${RADIUS} 0 0,1 ${SIZE},${RADIUS}`}
            stroke="#222"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Inner arc */}
          <Path
            d={`M ${STROKE_WIDTH},${RADIUS} A ${RADIUS - STROKE_WIDTH},${RADIUS - STROKE_WIDTH} 0 0,1 ${SIZE - STROKE_WIDTH},${RADIUS}`}
            stroke="#111"
            strokeWidth={STROKE_WIDTH / 2}
            fill="none"
          />
          {/* Bar lines */}
          {bars}
          {/* Ticks */}
          {ticks}
          {/* Needle pivot circle */}
          <Circle cx={RADIUS} cy={RADIUS} r={8} fill="#4F9EF5" />
          {/* Needle */}
          <Animated.View
            style={{
                position: 'absolute',
                left: RADIUS - 2,  
                top: RADIUS - (INNER_RADIUS - 20), 
                width: 3,
                height: INNER_RADIUS - 20,
                transform: [
                { translateY: (INNER_RADIUS - 20) / 2 }, 
                { rotate: angle },
                { rotate: '20deg' },
                { translateY: -(INNER_RADIUS - 20) / 2 },  
                ],
                alignItems: 'center',  
            }}
          >
            {/* Needle with gradient effect and pointy tip */}
            <View>
              {/* Gradient overlay */}
              <View style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: [{ rotate: '45deg' }],
              }}/>
            </View>
            
            {/* Pointy tip */}
            <View style={{
              position: 'absolute',
              bottom: -10,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderLeftWidth: 4,
              borderRightWidth: 5,
              borderBottomWidth: 50,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#4F9EF5',
              transform: [{ translateY: -5 }],
            }}/>
            <View style={styles.needle} />
          </Animated.View>
        </G>
      </Svg>
      {/* Digital speed */}
      <View style={styles.digitalContainer}>
        <Text style={styles.speedText}>{Math.round(value)}</Text>
        <Text style={styles.unitText}>KMPH</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.87)',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
  },
  clockContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  clock: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#4F9EF5',
  },
  needle: {
    flex: 1,
    width: 4,
    backgroundColor: '#4F9EF5',
    borderRadius: 2,
  },
  needleContainer: {
  shadowColor: '#4F9EF5',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 5,
  elevation: 5,
},
needleBody: {
  width: 10,
  height: '100%',
  backgroundColor: '#4F9EF5',
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  overflow: 'hidden',
},
needleShine: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255,255,255,0.2)',
  transform: [{ rotate: '45deg' }],
},
needleTip: {
  position: 'absolute',
  bottom: -10,
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderLeftWidth: 5,
  borderRightWidth: 5,
  borderBottomWidth: 10,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: '#4F9EF5',
  transform: [{ translateY: -5 }],
},
  digitalContainer: {
    position: 'absolute',
    left: 15,       
    top: 120,        
    flexDirection: 'row',
    alignItems: 'flex-end',
    },
  speedText: {
    fontSize: 84,
    fontFamily: 'Courier New',
    color: '#4F9EF5',
  },
  unitText: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: '#4F9EF5',
    marginLeft: 2,
    marginBottom: 9,
  },
});
