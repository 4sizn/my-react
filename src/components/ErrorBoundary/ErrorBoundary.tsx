import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 에러가 발생하면 state를 업데이트하여 fallback UI를 표시
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 서비스에 에러를 기록할 수 있습니다
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // fallback prop이 함수인 경우 에러 객체를 전달
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error!);
      }
      
      // fallback prop이 ReactNode인 경우 그대로 렌더링
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // 기본 fallback UI
      return (
        <div style={{ 
          padding: "20px", 
          backgroundColor: "#ffebee", 
          border: "1px solid #ef5350",
          borderRadius: "4px",
          color: "#c62828"
        }}>
          <h2>⚠️ 오류가 발생했습니다</h2>
          <details style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
            <summary>오류 상세 정보</summary>
            <p style={{ marginTop: "10px", fontFamily: "monospace", fontSize: "12px" }}>
              {this.state.error && this.state.error.toString()}
            </p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
