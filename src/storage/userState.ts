import { Storage } from '@apps-in-toss/framework';
import { type GameState } from '../hooks/useGameState';

// 토스 미니앱 호스트가 관리하는 영속 저장소.
// AsyncStorage(@react-native-async-storage)는 미니앱 webview 컨텍스트에서
// 매 실행 초기화되는 사례가 확인돼 SDK Storage로 교체함 — 누적 포인트가
// 앱 재시작/업데이트에도 유지되어야 한다는 요구사항을 충족하려면 필수.
const STORAGE_KEY = 'bingsu_shop:state_v1';

export async function loadPersistedState(): Promise<GameState | null> {
  try {
    const raw = await Storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export async function savePersistedState(state: GameState): Promise<void> {
  try {
    await Storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 저장 실패는 silent — 상태는 메모리에 유지됨
  }
}

export async function clearPersistedState(): Promise<void> {
  try {
    await Storage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
