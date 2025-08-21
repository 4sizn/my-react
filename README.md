# React Suspense with Error Boundary

React 18의 Suspense와 Error Boundary를 활용한 비동기 컴포넌트 로딩 시스템

## 📋 프로젝트 개요

이 프로젝트는 React의 Suspense와 Error Boundary를 활용하여 부팅 시퀀스를 시뮬레이션하는 시스템입니다. 비동기 작업을 우아하게 처리하고, 에러 발생 시 적절한 fallback UI를 제공합니다.

## 🚀 주요 기능

- **Suspense 통합**: 비동기 컴포넌트 로딩 중 fallback UI 표시
- **Error Boundary**: 컴포넌트 에러 발생 시 커스텀 에러 UI 표시
- **HOC (Higher-Order Component)**: `withProcedure`를 통한 비동기 로직 캡슐화
- **재시작 기능**: resetKey를 통한 컴포넌트 상태 초기화

## 🛠 기술 스택

- **React 18.3.1** - UI 라이브러리
- **TypeScript 5.2.2** - 타입 안정성
- **Vite 7.1.3** - 빌드 도구
- **Biome** - 린터 & 포맷터

## 📦 설치 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── withProcedure/
│   │   ├── withProcedure.tsx    # HOC for async operations
│   │   └── index.ts
│   ├── ErrorBoundary/
│   │   ├── ErrorBoundary.tsx    # Error boundary component
│   │   └── index.ts
│   └── index.ts
├── App.tsx                       # Main application
├── App.css
└── main.tsx
```

## 🔧 주요 컴포넌트

### withProcedure HOC

비동기 작업을 Suspense와 호환되도록 래핑하는 HOC입니다.

```typescript
const Component = withProcedure(UIComponent, async () => {
  // 비동기 작업
  return data;
});
```

**특징:**
- Promise를 Suspense와 호환되도록 변환
- resetKey를 통한 리소스 재생성 지원
- 에러 발생 시 Error Boundary로 전파

### ErrorBoundary

컴포넌트 트리에서 발생하는 에러를 캐치하고 fallback UI를 표시합니다.

```typescript
<ErrorBoundary fallback={<ErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

**특징:**
- 커스텀 fallback UI 지원
- 함수형 fallback으로 에러 객체 접근 가능
- 에러 로깅 기능

## 🎯 사용 예시

### 기본 사용법

```typescript
// 1. HOC로 컴포넌트 래핑
const AsyncComponent = withProcedure(
  MyComponent,
  async () => {
    const data = await fetchData();
    return data;
  }
);

// 2. Suspense와 ErrorBoundary로 감싸기
<ErrorBoundary fallback={<ErrorFallback />}>
  <Suspense fallback={<Loading />}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>
```

### 재시작 기능

```typescript
const [resetKey, setResetKey] = useState(0);

const handleRestart = () => {
  setResetKey(prev => prev + 1);
};

<AsyncComponent resetKey={resetKey} />
```

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 테스트 커버리지
npm run test:coverage
```

## 📝 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기
- `npm run lint` - 코드 검사
- `npm run format` - 코드 포맷팅
- `npm run check` - 린트 + 포맷팅

## 🔍 부팅 시퀀스 플로우

```
1. 커널 부팅 (동기)
   ↓
2. 시스템 부팅 (3초 비동기)
   ↓
3. OS 로딩 (3초 비동기, 50% 실패 확률)
```

각 단계에서:
- **로딩 중**: Suspense fallback 표시
- **성공**: 다음 단계 진행
- **실패**: Error Boundary fallback 표시

## 🤝 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

## 👥 작성자

- GitHub: [@4sizn](https://github.com/4sizn)
