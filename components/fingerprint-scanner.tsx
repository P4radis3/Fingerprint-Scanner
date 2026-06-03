"use client"

import { useState, useEffect, useCallback } from "react"
import { Lock, Unlock, Fingerprint, Shield, CheckCircle } from "lucide-react"
import type { ScanState } from "@/types/fingerprint"

export function FingerprintScanner() {
  const [state, setState] = useState<ScanState>("idle")
  const [scanProgress, setScanProgress] = useState(0)
  const [showStatusInfo, setShowStatusInfo] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleScanStart = useCallback(() => {
    if (state === "idle") {
      setState("scanning")
      setScanProgress(0)
    }
  }, [state])

  const handleScanEnd = useCallback(() => {
    if (state === "scanning") {
      setState("idle")
      setScanProgress(0)
    }
  }, [state])

  // Scanning progress simulation
  useEffect(() => {
    if (state === "scanning") {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          const next = prev + 2
          if (next >= 100) {
            setState("success")
            return 100
          }
          return next
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [state])

  // Success to unlocked transition
  useEffect(() => {
    if (state === "success") {
      const timeout = setTimeout(() => {
        setState("unlocked")
        setShowStatusInfo(false)
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [state])

  // Reset after unlocked
  useEffect(() => {
    if (state === "unlocked") {
      const timeout = setTimeout(() => {
        setState("idle")
        setScanProgress(0)
        setShowStatusInfo(true)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [state])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("bg-BG", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("bg-BG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,200,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Ambient glow */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          state === "unlocked"
            ? "bg-[radial-gradient(ellipse_at_center,rgba(0,255,150,0.15),transparent_70%)]"
            : state === "success"
              ? "bg-[radial-gradient(ellipse_at_center,rgba(0,255,200,0.1),transparent_70%)]"
              : "bg-[radial-gradient(ellipse_at_center,rgba(0,200,255,0.05),transparent_70%)]"
        }`}
      />

      {/* Top status bar */}
      {showStatusInfo && (
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start text-muted-foreground text-xs font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-foreground">SECURE ACCESS</span>
            </div>
            <div>TERMINAL: MAIN_ENTRANCE</div>
            <div>PROTOCOL: BIOMETRIC_V2</div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-foreground text-lg">{formatTime(currentTime)}</div>
            <div className="capitalize">{formatDate(currentTime)}</div>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>ONLINE</span>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full py-8 px-4">{/* Main content */}
        {/* Lock icon container */}
        <div
          className={`relative mb-8 transition-all duration-700 ${
            state === "unlocked" ? "scale-110 opacity-0 hidden" : "scale-100"
          }`}
        >
          {/* Outer ring */}
          <div
            className={`absolute -inset-4 rounded-full border-2 transition-all duration-500 ${
              state === "unlocked"
                ? "border-primary/50 scale-110"
                : state === "success"
                  ? "border-primary/40"
                  : state === "scanning"
                    ? "border-accent/30 animate-pulse"
                    : "border-border"
            }`}
          />

          {/* Inner glow ring */}
          <div
            className={`absolute -inset-2 rounded-full transition-all duration-500 ${
              state === "unlocked"
                ? "bg-primary/20 blur-md"
                : state === "success"
                  ? "bg-primary/15 blur-sm"
                  : "bg-transparent"
            }`}
          />

          {/* Lock/Unlock icon */}
          <div
            className={`relative w-20 h-20 flex items-center justify-center rounded-full transition-all duration-500 ${
              state === "unlocked"
                ? "bg-primary/20"
                : state === "success"
                  ? "bg-primary/10"
                  : "bg-card"
            }`}
          >
            {state === "unlocked" ? (
              <Unlock
                className="w-10 h-10 text-primary animate-in zoom-in duration-300"
                strokeWidth={1.5}
              />
            ) : state === "success" ? (
              <CheckCircle
                className="w-10 h-10 text-primary animate-in zoom-in duration-300"
                strokeWidth={1.5}
              />
            ) : (
              <Lock
                className={`w-10 h-10 transition-colors duration-300 ${
                  state === "scanning" ? "text-accent" : "text-muted-foreground"
                }`}
                strokeWidth={1.5}
              />
            )}
          </div>
        </div>

        {/* Status text */}
        <div className={`text-center mb-8 transition-all duration-500 ${
          state === "unlocked" ? "opacity-0 scale-90 hidden" : "opacity-100"
        }`}>
          <h1
            className={`text-2xl font-light tracking-widest mb-2 transition-colors duration-500 ${
              state === "unlocked"
                ? "text-primary"
                : state === "success"
                  ? "text-primary"
                  : "text-foreground"
            }`}
          >
            {state === "unlocked"
              ? "ДОСТЪП РАЗРЕШЕН"
              : state === "success"
                ? "ПРОВЕРКА УСПЕШНА"
                : state === "scanning"
                  ? "СКАНИРАНЕ..."
                  : "ЗАКЛЮЧЕНО"}
          </h1>
          <p className="text-muted-foreground text-sm tracking-wider">
            {state === "unlocked"
              ? "Вратата е отворена"
              : state === "success"
                ? "Идентичност потвърдена"
                : state === "scanning"
                  ? `Прогрес: ${scanProgress}%`
                  : "Поставете пръст за отключване"}
          </p>
        </div>

        {/* Fingerprint scanner area */}
        <div
          className={`relative cursor-pointer transition-all duration-300 ${
            state === "unlocked" ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
          onMouseDown={handleScanStart}
          onMouseUp={handleScanEnd}
          onMouseLeave={handleScanEnd}
          onTouchStart={handleScanStart}
          onTouchEnd={handleScanEnd}
        >
          {/* Scanner outer frame */}
          <div
            className={`relative w-48 h-64 rounded-3xl border-2 transition-all duration-500 ${
              state === "scanning"
                ? "border-accent shadow-[0_0_30px_rgba(0,200,255,0.3)]"
                : state === "success"
                  ? "border-primary shadow-[0_0_30px_rgba(0,255,200,0.4)]"
                  : "border-border hover:border-muted-foreground"
            }`}
          >
            {/* Scanner background */}
            <div className="absolute inset-1 rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
              {/* Scan line animation */}
              {state === "scanning" && (
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan"
                  style={{
                    top: `${scanProgress}%`,
                  }}
                />
              )}

              {/* Success fill animation */}
              {state === "success" && (
                <div className="absolute inset-0 bg-primary/10 animate-in fade-in duration-500" />
              )}

              {/* Fingerprint icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Fingerprint
                  className={`w-24 h-24 transition-all duration-500 ${
                    state === "scanning"
                      ? "text-accent/60"
                      : state === "success"
                        ? "text-primary"
                        : "text-muted-foreground/30"
                  }`}
                  strokeWidth={0.75}
                />
              </div>

              {/* Corner indicators */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-muted-foreground/30 rounded-tl" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-muted-foreground/30 rounded-tr" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-muted-foreground/30 rounded-bl" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-muted-foreground/30 rounded-br" />
            </div>

            {/* Progress bar */}
            {state === "scanning" && (
              <div className="absolute -bottom-6 left-0 right-0">
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-100 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Touch instruction */}
          <div
            className={`relative mt-4 text-center transition-opacity duration-300 ${
              state === "idle" ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-muted-foreground text-xs tracking-wider animate-pulse">
              НАТИСНЕТЕ И ЗАДРЪЖТЕ
            </span>
          </div>
        </div>

        {/* Unlocked state - Door animation */}
        {state === "unlocked" && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 sm:gap-10 md:gap-12 animate-in fade-in duration-500 px-4">
            {/* Access granted text */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-widest mb-2 sm:mb-3 text-primary animate-in zoom-in duration-500">
                ДОСТЪП РАЗРЕШЕН
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm tracking-wider">
                Вратата е отворена
              </p>
            </div>

            {/* Door frame */}
            <div className="w-48 sm:w-56 md:w-64 h-56 sm:h-72 md:h-80 border-4 border-primary/50 rounded-lg overflow-hidden animate-in zoom-in duration-500 relative">
              {/* Door panels sliding open */}
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full bg-primary/10 border-r border-primary/30 animate-slide-left" />
                <div className="w-1/2 h-full bg-primary/10 border-l border-primary/30 animate-slide-right" />
              </div>

              {/* Center glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse shadow-[0_0_40px_rgba(0,255,200,0.8)]" />
              </div>
            </div>

            {/* Welcome text */}
            <p className="text-primary text-lg sm:text-xl md:text-2xl font-light tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
              ДОБРЕ ДОШЛИ
            </p>
          </div>
        )}
      </div>

      {/* Bottom status */}
      {showStatusInfo && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-8 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>СИСТЕМА АКТИВНА</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>СЕНЗОР ГОТОВ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>ЗАЩИТА ВКЛ.</span>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes scan {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes slide-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes slide-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-scan {
          animation: scan 0.5s ease-in-out infinite;
        }

        .animate-slide-left {
          animation: slide-left 1s ease-out forwards;
        }

        .animate-slide-right {
          animation: slide-right 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
