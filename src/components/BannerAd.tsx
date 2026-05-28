import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InlineAd } from '@apps-in-toss/framework';
import { AD_GROUP_IDS } from '../constants/adConfig';

export function BannerAd() {
  const [failed, setFailed] = useState(false);

  // 광고 렌더 실패/노필 시 회색 placeholder로 폴백
  if (failed) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderLabel}>광고</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InlineAd
        adGroupId={AD_GROUP_IDS.banner}
        theme="light"
        tone="grey"
        variant="card"
        onAdFailedToRender={() => setFailed(true)}
        onNoFill={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  placeholder: {
    height: 50,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLabel: {
    fontSize: 12,
    color: '#999',
  },
});
