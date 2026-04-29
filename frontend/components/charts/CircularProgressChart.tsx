import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
    useAnimatedStyle,
} from "react-native-reanimated";
import Variables from "@/constants/Variables";

// 1. Create an Animated version of the Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressChartProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    animationDuration?: number;
}

const CircularProgressChart: React.FC<CircularProgressChartProps> = ({
    percentage,
    size = 160,
    strokeWidth = 10,
    animationDuration = 1500,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = useSharedValue(circumference);
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        const targetOffset = circumference - (percentage / 100) * circumference;

        strokeDashoffset.value = withTiming(targetOffset, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });

        textOpacity.value = withTiming(1, {
            duration: 300,
        });
    }, [percentage, circumference]);

    // 2. Use useAnimatedProps for SVG attributes
    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: strokeDashoffset.value,
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
    }));

    return (
        <View style={{ alignItems: "center" }}>
            <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
                <Svg width={size} height={size} style={{ position: "absolute" }}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={Variables.gray200}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* 3. Use the AnimatedCircle and pass animatedProps */}
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={Variables.green600}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        animatedProps={animatedProps}
                        strokeLinecap="round"
                        rotation={-90}
                        originX={size / 2}
                        originY={size / 2}
                    />
                </Svg>

                <Animated.View style={[animatedTextStyle, { alignItems: "center" }]}>
                    <Text style={{ fontSize: 48, fontWeight: "800", color: Variables.textPrimary }}>
                        {percentage.toFixed(0)}%
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: Variables.gray400 }}>正解率</Text>
                </Animated.View>
            </View>
        </View>
    );
};

export { CircularProgressChart };
