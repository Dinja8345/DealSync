import ReactConfetti from "react-confetti";
import type{ Dispatch, SetStateAction } from "react";

export interface confettiProps {
    showRightConfetti: boolean;
    setShowRightConfetti: Dispatch<SetStateAction<boolean>>
    showLeftConfetti: boolean
    setShowLeftConfetti: Dispatch<SetStateAction<boolean>>
}

const Confetti = ({
    showRightConfetti,
    setShowRightConfetti,
    showLeftConfetti,
    setShowLeftConfetti
}: confettiProps) => {

  const rightConfettiComplete = () => {
    setShowRightConfetti(false);
  };

  const leftConfettiComplete = () => {
    setShowLeftConfetti(false);
  };

  return (
    <div className="z-10 basis-1/12">
      {showRightConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          recycle={false}
          colors={[
            "#FF4500", // オレンジレッド
            "#FFA500", // オレンジ
            "#FFD700", // ゴールド
            "#FF69B4", // ホットピンク
            "#FF7F50", // コーラル
            "#FA8072", // サーモン
            "#F08080", // ライトコーラル
            "#FFB6C1", // ライトピンク
            "#FFE4B5", // モカシン (淡いオレンジ)
            "#DAA520", // ゴールデンロッド (くすんだゴールド)
          ]}
          opacity={0.8}
          gravity={0.1}
          initialVelocityX={10}
          initialVelocityY={15}
          confettiSource={{
            x: 0,
            y: window.innerHeight / 2,
            w: 0,
            h: 0,
          }}
          tweenDuration={3000}
          onConfettiComplete={() => rightConfettiComplete()}
        />
      )}

      {showLeftConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          recycle={false}
          colors={[
            "#FF4500", // オレンジレッド
            "#FFA500", // オレンジ
            "#FFD700", // ゴールド
            "#FF69B4", // ホットピンク
            "#FF7F50", // コーラル
            "#FA8072", // サーモン
            "#F08080", // ライトコーラル
            "#FFB6C1", // ライトピンク
            "#FFE4B5", // モカシン (淡いオレンジ)
            "#DAA520", // ゴールデンロッド (くすんだゴールド)
          ]}
          opacity={0.8}
          gravity={0.1}
          initialVelocityX={-10}
          initialVelocityY={15}
          confettiSource={{
            x: window.innerWidth,
            y: window.innerHeight / 2,
            w: 0,
            h: 0,
          }}
          tweenDuration={3000}
          onConfettiComplete={() => leftConfettiComplete()}
        />
      )}
    </div>
  );
};

export default Confetti;