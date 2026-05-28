import { createRoute } from '@granite-js/react-native';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { BG_DEFAULT } from '../constants/bingsus';

export const Route = createRoute('/policy', {
  component: PolicyScreen,
});

// 콘솔 등록 시 실제 이메일로 교체
const CONTACT_EMAIL = 'ksw03090@gmail.com';

function PolicyScreen() {
  // 비게임 출시 가이드: 토스 호스트가 그리는 ← 뒤로가기와
  // 자체 ← 뒤로가기는 동시에 보여서는 안 됨 → 자체 헤더는 제목만 표시.
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>이용 안내</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Section title="📌 서비스 안내">
          <P>
            '빙수만들고 포인트 받기'는 토스 미니앱이에요. 광고 시청을 통해
            토스 포인트를 받을 수 있는 캐주얼 콘텐츠 서비스예요.
          </P>
        </Section>

        <Section title="🔒 개인정보 처리 방침">
          <P>
            본 미니앱은 별도의 개인정보를 수집하지 않아요.
            모든 사용자 정보 처리는 토스 앱이 담당해요.
          </P>
          <P>
            보상 지급에 필요한 사용자 식별은 토스 앱이 제공하는
            식별자만 사용해요. 개인을 알아볼 수 있는 정보는
            저장하지 않아요.
          </P>
          <P>
            앱 사용 기록(빙수 진행 상태, 출석 정보)은 사용자
            기기에만 저장되며, 외부 서버로 전송되지 않아요.
          </P>
        </Section>

        <Section title="💰 보상 안내">
          <Bullet>매일 출석 선물 1번 + 빙수 10그릇까지 받을 수 있어요</Bullet>
          <Bullet>광고 1번당 1그릇씩 진행되며, 광고 10번에 1그릇 완성돼요</Bullet>
          <Bullet>0원 보상은 절대 발생하지 않아요</Bullet>
          <Bullet>받은 토스 포인트는 토스 앱에서 확인할 수 있어요</Bullet>
        </Section>

        <Section title="⚠️ 유의사항">
          <Bullet>
            보상 예산이 모두 사용되면 일시적으로 보상 지급이 멈출 수 있어요
          </Bullet>
          <Bullet>
            광고가 정상적으로 표시되지 않으면 잠시 후 다시 시도해주세요
          </Bullet>
          <Bullet>
            매일 자정(한국 시간)에 빙수 카운트와 출석 선물이 초기화돼요
          </Bullet>
        </Section>

        <Section title="📮 고객센터">
          <P>문의 사항이 있으면 이메일로 연락해주세요</P>
          <Text style={styles.email}>{CONTACT_EMAIL}</Text>
          <P>영업일 기준 1~3일 이내에 답변드릴게요</P>
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>v1.0.1</Text>
        </View>
      </ScrollView>
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

function P({ children }: { children: React.ReactNode }) {
  return <Text style={styles.body}>{children}</Text>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_DEFAULT,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202632',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202632',
  },
  sectionBody: {
    gap: 8,
  },
  body: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 15,
    color: '#00C4FF',
    fontWeight: '700',
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  email: {
    fontSize: 17,
    fontWeight: '700',
    color: '#00C4FF',
    paddingVertical: 4,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#AAA',
  },
});
