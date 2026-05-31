import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import Variables from "@/constants/Variables";

type FloatingSnippetProps = {
    text: string;
    style: object;
    delay: number;
    drift: number;
};

type TypingDotProps = {
    delay: number;
};

const FloatingSnippet = ({ text, style, delay, drift }: FloatingSnippetProps) => {
    const progress = useSharedValue(0);

    React.useEffect(() => {
        progress.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
                    withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
                ),
                -1,
                false,
            ),
        );
    }, [delay, progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 0.15, 0.85, 1], [0, 1, 1, 0]),
        transform: [
            { translateY: interpolate(progress.value, [0, 1], [10, -18]) },
            { translateX: interpolate(progress.value, [0, 1], [0, drift]) },
            { rotate: `${interpolate(progress.value, [0, 1], [-3, 4])}deg` },
        ],
    }));

    return (
        <Animated.View style={[styles.snippet, style, animatedStyle]}>
            <Text style={styles.snippetText}>{text}</Text>
        </Animated.View>
    );
};

const TypingDot = ({ delay }: TypingDotProps) => {
    const progress = useSharedValue(0);

    React.useEffect(() => {
        progress.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 280, easing: Easing.inOut(Easing.quad) }),
                    withTiming(0, { duration: 280, easing: Easing.inOut(Easing.quad) }),
                ),
                -1,
                false,
            ),
        );
    }, [delay, progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0.35, 1]),
        transform: [
            { scale: interpolate(progress.value, [0, 1], [0.75, 1.15]) },
            { translateY: interpolate(progress.value, [0, 1], [0, -3]) },
        ],
    }));

    return <Animated.View style={[styles.typingDot, animatedStyle]} />;
};

const LoadingScreen = () => {
    const { width } = useWindowDimensions();
    const sceneWidth = Math.min(width - 40, 380);

    const cardLift = useSharedValue(0);
    const penMotion = useSharedValue(0);
    const scan = useSharedValue(0);
    const bubbleMotion = useSharedValue(0);

    React.useEffect(() => {
        cardLift.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
                withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
            ),
            -1,
            false,
        );

        penMotion.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
                withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            false,
        );

        scan.value = withRepeat(withTiming(1, { duration: 2300, easing: Easing.inOut(Easing.cubic) }), -1, false);

        bubbleMotion.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
                withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
            ),
            -1,
            false,
        );
    }, [bubbleMotion, cardLift, penMotion, scan]);

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(cardLift.value, [0, 1], [0, -6]) },
            { scale: interpolate(cardLift.value, [0, 1], [1, 1.015]) },
        ],
    }));

    const penStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(penMotion.value, [0, 1], [0, -8]) },
            { rotate: `${interpolate(penMotion.value, [0, 1], [-10, 4])}deg` },
        ],
    }));

    const scanStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(scan.value, [0, 1], [-60, 230]) }],
        opacity: interpolate(scan.value, [0, 0.1, 0.5, 0.9, 1], [0, 0.75, 0.3, 0.75, 0]),
    }));

    const bubbleStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(bubbleMotion.value, [0, 1], [0, -10]) },
            { rotate: `${interpolate(bubbleMotion.value, [0, 1], [-3, 3])}deg` },
        ],
    }));

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.glowOne} />
            <View style={styles.glowTwo} />

            <View style={styles.content}>
                <View>
                    <Text style={styles.kicker}>AI ANALYSIS IN PROGRESS</Text>
                    <Text style={styles.title}>Your essay is being scanned, polished, and scored.</Text>
                </View>

                <View style={[styles.stage, { width: sceneWidth }]}>
                    <FloatingSnippet text="The impact of" style={styles.snippetTopLeft} delay={0} drift={10} />
                    <FloatingSnippet text="technology on..." style={styles.snippetTopRight} delay={220} drift={-10} />
                    <FloatingSnippet text="In conclusion" style={styles.snippetBottomLeft} delay={440} drift={14} />

                    <Animated.View style={[styles.paperCard, cardStyle]}>
                        <Animated.View style={[styles.scanBeam, scanStyle]} />

                        <View style={styles.paperHeader}>
                            <View style={styles.paperDot} />
                            <Text style={styles.paperLabel}>Essay draft</Text>
                        </View>

                        <View style={styles.lineGroup}>
                            <View style={[styles.line, styles.lineLong]} />
                            <View style={[styles.line, styles.lineMedium]} />
                            <View style={[styles.line, styles.lineShort]} />
                            <View style={[styles.line, styles.lineLong]} />
                            <View style={[styles.line, styles.lineMedium]} />
                        </View>

                        <View style={styles.footerRow}>
                            <View style={styles.typingBubble}>
                                <View style={styles.typingDotsRow}>
                                    <TypingDot delay={0} />
                                    <TypingDot delay={120} />
                                    <TypingDot delay={240} />
                                </View>
                                <Text style={styles.typingText}>checking grammar and flow</Text>
                            </View>

                            <Animated.View style={[styles.penBadge, penStyle]}>
                                <FontAwesome6 name="pen-nib" size={26} color={Variables.white} />
                            </Animated.View>
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.bubble, bubbleStyle]}>
                        <Text style={styles.bubbleEmoji}>✍</Text>
                        <Text style={styles.bubbleText}>Refining your wording</Text>
                    </Animated.View>
                </View>

                <View style={styles.statusCard}>
                    <Text style={styles.statusTitle}>AI is reading between the lines</Text>
                    <Text style={styles.statusText}>
                        Looking for ideas, structure, grammar, and the little details that make an essay shine.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#0B1120",
    },
    glowOne: {
        position: "absolute",
        top: -50,
        left: -35,
        width: 180,
        height: 180,
        borderRadius: 999,
        backgroundColor: "rgba(59, 130, 246, 0.22)",
    },
    glowTwo: {
        position: "absolute",
        right: -55,
        bottom: 40,
        width: 220,
        height: 220,
        borderRadius: 999,
        backgroundColor: "rgba(16, 185, 129, 0.18)",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 28,
        justifyContent: "space-between",
    },
    kicker: {
        color: "#7DD3FC",
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 2.5,
        textAlign: "center",
        marginBottom: 10,
    },
    title: {
        color: Variables.white,
        fontSize: 28,
        fontWeight: "900",
        lineHeight: 36,
        textAlign: "center",
        paddingHorizontal: 8,
    },
    stage: {
        alignSelf: "center",
        minHeight: 380,
        justifyContent: "center",
        alignItems: "center",
    },
    snippet: {
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderColor: "rgba(148, 163, 184, 0.22)",
        borderWidth: 1,
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxWidth: 150,
    },
    snippetTopLeft: {
        top: 18,
        left: 14,
    },
    snippetTopRight: {
        top: 72,
        right: 10,
    },
    snippetBottomLeft: {
        bottom: 18,
        left: 26,
    },
    snippetText: {
        color: "#E2E8F0",
        fontSize: 12,
        fontWeight: "700",
    },
    paperCard: {
        width: "100%",
        maxWidth: 340,
        minHeight: 260,
        borderRadius: 28,
        backgroundColor: "#F8FAFC",
        padding: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(148, 163, 184, 0.22)",
        shadowColor: "#000",
        shadowOpacity: 0.26,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
    },
    scanBeam: {
        position: "absolute",
        left: 14,
        right: 14,
        height: 72,
        borderRadius: 22,
        backgroundColor: "rgba(59, 130, 246, 0.12)",
    },
    paperHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 18,
    },
    paperDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#22C55E",
    },
    paperLabel: {
        color: "#0F172A",
        fontWeight: "800",
        fontSize: 14,
    },
    lineGroup: {
        gap: 14,
        paddingTop: 10,
    },
    line: {
        height: 12,
        borderRadius: 999,
        backgroundColor: "rgba(15, 23, 42, 0.08)",
    },
    lineLong: {
        width: "94%",
    },
    lineMedium: {
        width: "78%",
    },
    lineShort: {
        width: "56%",
    },
    footerRow: {
        marginTop: 28,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
    },
    typingBubble: {
        flex: 1,
        backgroundColor: "#E2E8F0",
        borderRadius: 22,
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    typingDotsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    typingDot: {
        width: 9,
        height: 9,
        borderRadius: 999,
        backgroundColor: Variables.primary600,
        marginRight: 6,
    },
    typingText: {
        color: "#334155",
        fontSize: 12,
        fontWeight: "700",
    },
    penBadge: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Variables.primary600,
        shadowColor: Variables.primary600,
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    bubble: {
        position: "absolute",
        right: 14,
        top: 120,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgba(14, 165, 233, 0.16)",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "rgba(125, 211, 252, 0.22)",
    },
    bubbleEmoji: {
        fontSize: 18,
        color: Variables.white,
    },
    bubbleText: {
        color: Variables.white,
        fontWeight: "700",
        fontSize: 12,
    },
    statusCard: {
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "rgba(148, 163, 184, 0.18)",
        padding: 18,
    },
    statusTitle: {
        color: Variables.white,
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 8,
        textAlign: "center",
    },
    statusText: {
        color: "#CBD5E1",
        fontSize: 13,
        lineHeight: 20,
        textAlign: "center",
    },
});
