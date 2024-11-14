export default function getKoreanEnum(e) {
    switch(e) {
      case "ATTEND": return "출석";
      case "ABSENT": return "결석";
      case "LEAVE": return "출튀";
      case "FAKE": return "대리 출석";
    }
}