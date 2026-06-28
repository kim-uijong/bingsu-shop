import { createRoute, IOScrollView } from '@granite-js/react-native';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BINGSU_LIST,
  TIER_LABELS,
  TIER_WEIGHTS,
  type BingsuTier,
} from '../constants/bingsus';
import { TIER_MIN, TIER_MAX } from '../constants/probabilities';
import { BG_DEFAULT } from '../constants/bingsus';
import { BannerAd } from '../components/BannerAd';

const THUMBNAIL_URL = 'https://raw.githubusercontent.com/kim-uijong/bingsu-asset/main/thumbnail.png';

export const Route = createRoute('/probability-info', {
  component: ProbabilityInfoScreen,
});

const TIER_ORDER: BingsuTier[] = ['classic', 'fruit', 'premium', 'special'];

const TIER_BG: Record<BingsuTier, string> = {
  classic: '#FFF5E4',
  fruit:   '#FFE4E4',
  premium: '#FFF9E4',
  special: '#FFF3D4',
};

function getTierWeight(tier: BingsuTier): number {
  return TIER_WEIGHTS.find(t => t.value === tier)?.weight ?? 0;
}

function ProbabilityInfoScreen() {
  // 비게임 출시 가이드: 토스 호스트가 그리는 ← 뒤로가기와
  // 자체 ← 뒤로가기는 동시에 보여서는 안 됨 → 자체 헤더는 제목만 표시.
  return (
    <SafeAreaView style={styles.safe}>
      <IOScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 환영 배너 — 이전 IntroModal 컨텐츠 통합 */}
        <View style={styles.welcomeBox}>
          <Image source={{ uri: THUMBNAIL_URL }} style={styles.welcomeImage} resizeMode="contain" />
          <Text style={styles.welcomeTitle}>
            빙수만들고 포인트 받기에{'\n'}오신 것을 환영해요!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            매일 다른 빙수를 만들어요{'\n'}최대 1,000원까지 받아요
          </Text>
        </View>

        {/* 출석 선물 */}
        <Section title="🎁 출석 선물">
          <Text style={styles.body}>광고를 보고 포인트 받아요 (하루 5번 · 2시간 간격)</Text>
        </Section>

        {/* 빙수 만드는 방법 */}
        <Section title="🍧 빙수 만드는 방법">
          <Text style={styles.body}>광고 10번을 보면 빙수 1그릇이 완성돼요</Text>
          <View style={styles.stepBox}>
            <Text style={styles.stepText}>1단계 · 얼음 갈기 (광고 5번)</Text>
            <Text style={styles.stepText}>2단계 · 토핑 올리기 (광고 5번)</Text>
          </View>
          <Text style={styles.body}>
            하루 최대 10그릇 + 출석 선물 5번까지 받을 수 있어요
          </Text>
        </Section>

        {/* 4티어 등장 확률 */}
        <Section title="🍧 13종 빙수 친구들">
          <Text style={styles.body}>빙수가 등장할 때 4가지 종류 중 하나가 나와요</Text>
          {TIER_ORDER.map(tier => {
            const bingsus = BINGSU_LIST.filter(b => b.tier === tier);
            const min = TIER_MIN[tier];
            const max = TIER_MAX[tier];
            const weight = getTierWeight(tier);
            return (
              <View key={tier} style={[styles.tierCard, { backgroundColor: TIER_BG[tier] }]}>
                <View style={styles.tierHeader}>
                  <Text style={styles.tierLabel}>{TIER_LABELS[tier]}</Text>
                  <Text style={styles.tierWeight}>{weight}%</Text>
                </View>
                <Text style={styles.tierBingsus}>
                  {bingsus.map(b => `${b.emoji} ${b.name}`).join(' · ')}
                </Text>
                <Text style={styles.tierReward}>
                  보상: {min.toLocaleString()}원 ~ {max.toLocaleString()}원
                </Text>
              </View>
            );
          })}
        </Section>

        {/* 안내 */}
        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>🎉 0원 보상은 절대 없어요!</Text>
          <Text style={styles.noticeBody}>
            모든 빙수에는 반드시 보상이 있어요. 매일 다른 빙수가 기다리고 있어요!
          </Text>
        </View>

        {/* BannerAd는 InlineAd의 ImpressionArea가 IOContext를 요구하므로
            반드시 IOScrollView 내부에 둬야 함 (granite-js 규약) */}
        <BannerAd />
      </IOScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_DEFAULT,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 24,
  },
  welcomeBox: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 4,
  },
  welcomeImage: {
    width: 160,
    height: 160,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#202632',
    textAlign: 'center',
    lineHeight: 30,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202632',
  },
  sectionBody: {
    gap: 8,
  },
  body: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  stepBox: {
    backgroundColor: '#F0FAFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  stepText: {
    fontSize: 16,
    color: '#202632',
    fontWeight: '600',
  },
  tierCard: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 6,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202632',
  },
  tierWeight: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00C4FF',
  },
  tierBingsus: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  tierReward: {
    fontSize: 16,
    color: '#202632',
    fontWeight: '600',
    marginTop: 4,
  },
  noticeBox: {
    backgroundColor: '#FFF9E4',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    gap: 6,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202632',
  },
  noticeBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
