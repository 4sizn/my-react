import React, { ComponentType } from "react";

export function wrappedPromise<T>(promise: Promise<T>) {
  let status: "pending" | "success" | "error" = "pending";
  let result: T | undefined = undefined;

  const suspender = promise
    .then((data: T) => {
      status = "success";
      result = data;
    })
    .catch((error) => {
      status = "error";
      result = error;
    });

  return {
    suspenseRead() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
}

/**
 * @param WrappedComponent 래핑할 컴포넌트
 * @param procedure 데이터를 가져오는 함수
 * @returns 래핑된 컴포넌트
 */
export function withProcedure<T, P extends React.PropsWithChildren>(
  WrappedComponent: ComponentType<P>,
  procedure: () => Promise<T> | T
): React.FC<P & { output?: T }> {
  // 컴포넌트 외부에서 resource를 캐싱하여 재사용
  let resource: ReturnType<typeof wrappedPromise> | null = null;
  
  return function (props: P) {
    // 최초 렌더링 시에만 resource 생성
    if (!resource) {
      const promise = Promise.resolve(procedure());
      resource = wrappedPromise(promise);
    }

    // Suspense가 처리할 수 있도록 바로 suspenseRead 호출
    // pending 상태면 suspender를 throw하여 Suspense fallback 표시
    // error 상태면 error를 throw하여 Error Boundary나 Suspense가 처리
    const data = resource.suspenseRead();
    return <WrappedComponent {...props} output={data} />;
  };
}
