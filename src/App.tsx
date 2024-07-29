import React, { Suspense } from "react";
import { withProcedure } from "./components";
function App() {
  return (
    <Suspense fallback="커널 부팅중...">
      <KurnelComp>
        <Suspense>
          <BootComponent>
            <Suspense fallback="OS 준비중..">
              <UIComponent>
                <Suspense fallback="OS 준비중..1">
                  <UIComponent />
                </Suspense>
              </UIComponent>
            </Suspense>
          </BootComponent>
        </Suspense>
      </KurnelComp>
    </Suspense>
  );
}

export default App;

const KurnelComp = withProcedure(KurnelUI, () => {
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
      }, 0);
    })
);

const UIComponent = withProcedure(
  OSUI,
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("OS 준비완료");
      }, 3000);
    })
);

function KurnelUI(props: React.PropsWithChildren) {
  return (
    <div>
      <div>KurnelUI 완료</div>
      <div {...props} />
    </div>
  );
}

function BootUI(props: React.PropsWithChildren) {
  return (
    <div>
      <div>BOOTUI 완료</div>
      <div {...props} />
    </div>
  );
}

function OSUI(props: React.PropsWithChildren) {
  return (
    <div>
      <div>OSUI 완료</div>
      <div {...props} />
    </div>
  );
}
