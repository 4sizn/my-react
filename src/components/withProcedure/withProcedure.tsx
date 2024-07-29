import React, { ComponentType, useEffect, useRef, useState } from "react";

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

export function withProcedure<T, P extends React.PropsWithChildren>(
  WrappedComponent: ComponentType<P>,
  procedure: () => Promise<T> | T
) {
  return function (props: P) {
    const [resource, setResource] = useState<ReturnType<
      typeof wrappedPromise
    > | null>(null);
    const initialized = useRef(false);

    useEffect(() => {
      if (!initialized.current) {
        const promise = Promise.resolve(procedure());
        setResource(wrappedPromise(promise));
        initialized.current = true;
      }
    }, []);

    if (!resource) {
      // 로딩 상태 처리 로직 추가
      return <div>Loading...</div>;
    }

    const data = resource.suspenseRead();

    return <WrappedComponent {...props} data={data} />;
  };
}
