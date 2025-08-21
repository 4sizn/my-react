import type React from "react";
import { Suspense } from "react";

import { ErrorBoundary, withProcedure } from "./components";

function App() {
  return (
    <div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        🔄 다시 시작 (시도)
      </button>

      <ErrorBoundary
        fallback={
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fff3e0",
              border: "2px solid #ff9800",
              borderRadius: "8px",
              margin: "20px",
            }}
          >
            <h2>🔧 시스템 오류</h2>
            <p>부팅 과정에서 문제가 발생했습니다. 다시 시작 버튼을 눌러주세요.</p>
          </div>
        }
      >
        <Suspense fallback={<div>커널 부팅중...</div>}>
          <KernelComp>
            <ErrorBoundary fallback={<div style={{ color: "red" }}>⚠️ Boot 시스템 오류 발생!</div>}>
              <Suspense fallback={<div>시스템 부팅중...</div>}>
                <BootComponent>
                  <ErrorBoundary
                    fallback={(error: Error) => (
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: "#ffebee",
                          border: "1px solid #f44336",
                          borderRadius: "4px",
                          margin: "10px",
                        }}
                      >
                        <strong>OS 로딩 실패:</strong> {error.message}
                      </div>
                    )}
                  >
                    <Suspense fallback={<div>OS 준비중..</div>}>
                      <UIComponent>
                        <Suspense fallback={<div>OS 준비중..1</div>}>
                          <UIComponent />
                        </Suspense>
                      </UIComponent>
                    </Suspense>
                  </ErrorBoundary>
                </BootComponent>
              </Suspense>
            </ErrorBoundary>
          </KernelComp>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;

const KernelComp = withProcedure(KernelUI, () => {
  console.log("커널");
  return "커널 준비완료";
});

const BootComponent = withProcedure(
  BootUI,
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log("부팅중");
        resolve("System 준비완료");
      }, 3000);
    }),
);

const UIComponent = withProcedure(
  OSUI,
  () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        // 테스트를 위해 50% 확률로 에러 발생
        if (Math.random() > 0.5) {
          reject(new Error("OS 로딩 실패!"));
        } else {
          resolve("OS 준비완료");
        }
      }, 3000);
    }),
);

function KernelUI(props: React.PropsWithChildren<{ output?: string }>) {
  return (
    <div>
      <div>KernelUI 완료 ##{props?.output}</div>
      {props.children}
    </div>
  );
}

function BootUI(props: React.PropsWithChildren<{ output?: string }>) {
  return (
    <div>
      <div>BOOTUI 완료 ##{props?.output}</div>
      {props.children}
    </div>
  );
}

function OSUI(props: React.PropsWithChildren<{ output?: string }>) {
  return (
    <div>
      <div>OSUI 완료 ##{props?.output}</div>
      {props.children}
    </div>
  );
}
