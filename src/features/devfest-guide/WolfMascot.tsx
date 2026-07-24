import styles from "./devfest-guide.module.css";
import type { GuideState } from "./types";

type WolfMascotProps = {
  state: GuideState;
  pointerX?: number;
  pointerY?: number;
};

const stateClassNames: Partial<Record<GuideState, string>> = {
  hover: styles.hover,
  thinking: styles.thinking,
  speaking: styles.speaking,
  success: styles.success,
  error: styles.error
};

export function WolfMascot({ state, pointerX = 0, pointerY = 0 }: WolfMascotProps) {
  const eyeX = Math.max(-1, Math.min(1, pointerX)) * 2;
  const eyeY = Math.max(-1, Math.min(1, pointerY)) * 1.5;
  const stateClassName = stateClassNames[state] ?? "";

  return (
    <svg
      viewBox="0 0 200 180"
      aria-hidden="true"
      focusable="false"
      className={`${styles.wolf} ${stateClassName}`}
    >
      <ellipse className={styles.shadow} cx="103" cy="170" rx="53" ry="6" />

      <g
        className={styles.figure}
        stroke="var(--wolf-outline)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g className={styles.tailGroup}>
          <path
            d="M137 111C158 99 176 104 180 119C184 135 169 148 151 143C162 137 165 126 157 121C151 117 145 119 139 124Z"
            fill="var(--wolf-fur-shade)"
          />
          <path
            d="M173 132C168 142 158 146 151 143C158 138 162 133 162 127C167 128 171 130 173 132Z"
            fill="var(--wolf-cream)"
            stroke="none"
          />
        </g>

        <g className={styles.legs}>
          <path
            d="M76 137C74 148 72 159 76 167C79 172 91 171 92 166C91 162 86 161 83 159L88 139Z"
            fill="var(--wolf-fur-shade)"
          />
          <path
            d="M120 137C123 149 125 159 121 167C118 172 106 171 105 166C106 162 111 161 114 159L109 139Z"
            fill="var(--wolf-fur)"
          />
        </g>

        <path
          className={styles.body}
          d="M66 92C74 80 87 75 101 76C117 76 132 85 138 100L136 129C130 144 115 150 99 149C82 149 68 141 63 127L62 105C62 100 63 96 66 92Z"
          fill="var(--wolf-fur)"
        />

        <g className={styles.shirt}>
          <path
            d="M72 92C78 85 86 82 97 82C110 81 122 85 130 94L134 125C128 137 116 142 99 142C83 142 72 136 66 125L68 99Z"
            fill="white"
          />
          <path d="M69 96L80 85L88 92L77 105Z" fill="var(--google-blue)" stroke="none" />
          <path d="M130 96L119 85L111 92L122 105Z" fill="var(--google-red)" stroke="none" />
          <g className={styles.shirtMark} stroke="none">
            <path d="M85 108L94 99L100 105L91 114Z" fill="var(--google-blue)" />
            <path d="M94 99L103 108L97 114L88 105Z" fill="var(--google-red)" />
            <path d="M103 108L112 117L106 123L97 114Z" fill="var(--google-yellow)" />
            <path d="M94 117L103 108L109 114L100 123Z" fill="var(--google-green)" />
          </g>
        </g>

        <g className={styles.leftArmGroup}>
          <path
            d="M69 97C58 101 51 113 52 127C53 138 59 146 66 145C72 143 72 137 68 132C64 127 65 119 72 114Z"
            fill="var(--wolf-fur-shade)"
          />
          <path
            d="M65 143C60 147 61 153 66 154C71 154 74 149 70 144Z"
            fill="var(--wolf-paw)"
          />
        </g>

        <g className={styles.rightArmGroup}>
          <path
            d="M130 97C143 101 149 113 147 127C146 138 140 146 133 145C127 143 127 137 131 132C135 127 134 119 127 114Z"
            fill="var(--wolf-fur)"
          />
          <path
            d="M134 143C139 147 138 153 133 154C128 154 125 149 129 144Z"
            fill="var(--wolf-paw)"
          />
        </g>

        <g className={styles.headGroup}>
          <path
            className={styles.leftEar}
            d="M66 47L61 17C60 12 65 10 69 14L86 33Z"
            fill="var(--wolf-fur-shade)"
          />
          <path d="M68 39L66 23L78 36Z" fill="var(--wolf-ear)" stroke="none" />
          <path
            className={styles.rightEar}
            d="M132 47L139 18C140 13 135 10 131 14L113 33Z"
            fill="var(--wolf-fur)"
          />
          <path d="M130 39L134 23L121 36Z" fill="var(--wolf-ear)" stroke="none" />

          <path
            className={styles.head}
            d="M67 47C73 34 85 28 99 28C114 28 127 36 132 49C139 59 136 75 129 84C122 96 111 102 98 102C84 102 72 96 66 85C58 75 58 58 67 47Z"
            fill="var(--wolf-fur)"
          />
          <path
            className={styles.faceCream}
            d="M70 59C75 45 85 40 97 44C105 39 118 45 124 57C130 69 124 86 113 94C104 101 90 99 81 92C71 84 66 70 70 59Z"
            fill="var(--wolf-cream)"
            stroke="none"
          />
          <path
            className={styles.muzzle}
            d="M80 73C84 64 91 62 98 67C105 62 113 65 117 74C121 84 111 94 99 95C86 95 76 85 80 73Z"
            fill="var(--wolf-muzzle)"
            stroke="none"
          />

          <g className={styles.baseEyes}>
            <ellipse cx="86" cy="61" rx="6" ry="6.5" fill="white" stroke="none" />
            <ellipse cx="111" cy="61" rx="6" ry="6.5" fill="white" stroke="none" />
            <g
              className={styles.pupils}
              style={{ transform: `translate(${eyeX}px, ${eyeY}px)` }}
            >
              <circle cx="86" cy="62" r="3" fill="var(--wolf-eye)" stroke="none" />
              <circle cx="111" cy="62" r="3" fill="var(--wolf-eye)" stroke="none" />
              <circle cx="85" cy="60.7" r="1" fill="white" stroke="none" />
              <circle cx="110" cy="60.7" r="1" fill="white" stroke="none" />
            </g>
          </g>

          <path
            className={styles.eyelids}
            d="M80 62Q86 68 92 62M105 62Q111 68 117 62"
          />
          <path
            d="M94 74Q99 70 104 74Q101 80 99 80Q96 80 94 74Z"
            fill="var(--wolf-nose)"
            stroke="none"
          />
          <path
            className={styles.mouthLine}
            d="M99 80Q95 86 90 82M99 80Q104 86 109 82"
            fill="none"
            stroke="var(--wolf-nose)"
            strokeWidth="2.2"
          />
          <ellipse
            className={styles.mouthOpen}
            cx="99"
            cy="84"
            rx="7"
            ry="4"
            fill="var(--wolf-mouth)"
            stroke="var(--wolf-nose)"
            strokeWidth="1.8"
          />
          <ellipse cx="78" cy="76" rx="4" ry="2" fill="var(--wolf-blush)" stroke="none" />
          <ellipse cx="120" cy="76" rx="4" ry="2" fill="var(--wolf-blush)" stroke="none" />
        </g>
      </g>

      <g className={styles.thoughts} aria-hidden="true">
        <circle cx="137" cy="48" r="4" fill="var(--google-blue)" />
        <circle cx="148" cy="36" r="5" fill="var(--google-yellow)" />
        <path
          d="M162 20L166 14L170 20L177 21L172 26L173 33L166 30L160 33L161 26L156 21Z"
          fill="var(--google-red)"
        />
      </g>

      <g
        className={styles.successMarks}
        aria-hidden="true"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M42 75L32 69M46 64L42 54" stroke="var(--google-yellow)" />
        <path d="M154 77L164 70M151 65L157 55" stroke="var(--google-blue)" />
      </g>
    </svg>
  );
}
