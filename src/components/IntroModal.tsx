import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const THUMBNAIL_URL = 'https://raw.githubusercontent.com/kim-uijong/bingsu-asset/main/thumbnail.png';

// 첫 사용자 환영 화면 — 게임 규칙 + 보상 안내
export function IntroModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Image source={{ uri: THUMBNAIL_URL }} style={styles.welcomeImage} resizeMode="contain" />
            <Text style={styles.title}>빙수만들고 포인트 받기에{'\n'}오신 것을 환영해요!</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎁 출석 선물</Text>
              <Text style={styles.sectionBody}>광고를 보고 포인트 받아요 (하루 5번·2시간 간격)</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🍧 빙수 만들기</Text>
              <Text style={styles.sectionBody}>
                광고 10번을 보면 빙수 1그릇 완성!{'\n'}
                얼음 갈기 5번 + 토핑 올리기 5번
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🌟 4가지 등급</Text>
              <Text style={styles.sectionBody}>
                🍧 추억 (60%) · 🍓 과일 (25%){'\n'}
                ✨ 프리미엄 (10%) · 🌟 특별 (5%)
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💰 보상</Text>
              <Text style={styles.sectionBody}>
                0원은 절대 없어요!{'\n'}
                받은 토스 포인트로 사용할 수 있어요
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📅 하루 한정</Text>
              <Text style={styles.sectionBody}>하루 빙수 10그릇 + 출석 선물 5번</Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>🍧 시작하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  content: {
    paddingBottom: 20,
    gap: 16,
    alignItems: 'center',
  },
  welcomeImage: {
    // 1932x828 가로 배너 원본 — 카드 너비에 꽉 차게 + 비율 유지
    width: '100%',
    aspectRatio: 1932 / 828,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#202632',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  section: {
    width: '100%',
    backgroundColor: '#F0FAFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#202632',
  },
  sectionBody: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#00C4FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
