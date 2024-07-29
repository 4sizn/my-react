import React, { ComponentType, useEffect, useState } from "react";

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

export function withProcedure<P extends React.PropsWithChildren>(
  WrappedComponent: ComponentType<P>,
  procedure: any
) {
  const resource = () => procedure;
  return function (props: P) {
    const [a, setA] = useState(null);
    useEffect(() => {
      setA(resource());
    }, []);

    const data = a?.suspenseRead();
    if (!data) return;
    return <WrappedComponent {...props} />;
  };
}
