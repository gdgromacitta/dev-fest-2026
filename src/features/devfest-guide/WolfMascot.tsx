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
      viewBox="0 0 220 200"
      aria-hidden="true"
      focusable="false"
      className={`${styles.wolf} ${stateClassName}`}
    >
      <ellipse className={styles.shadow} cx="111" cy="190" rx="56" ry="6" />

      <g
        className={styles.figure}
        stroke="var(--wolf-outline)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g className={styles.tailGroup}>
          <path
            d="M145 126C165 106 191 113 197 134C203 156 183 174 157 166C173 159 179 148 173 139C168 132 158 134 149 145Z"
            fill="var(--wolf-fur-shade)"
          />
          <path
            d="M190 150C185 162 170 170 157 166C169 160 176 153 177 145C183 145 187 147 190 150Z"
            fill="var(--wolf-cream)"
            stroke="none"
          />
          <path
            d="M145 126C165 106 191 113 197 134C203 156 183 174 157 166"
            fill="none"
          />
        </g>

        <g className={styles.legs}>
          <path
            d="M81 155C78 167 77 180 82 187C87 191 100 189 100 183C98 178 92 178 89 175L94 156Z"
            fill="var(--wolf-fur-shade)"
          />
          <path
            d="M139 155C142 168 143 180 138 187C133 191 120 189 120 183C122 178 128 178 131 175L126 156Z"
            fill="var(--wolf-fur)"
          />
          <path d="M82 184Q90 181 98 184" fill="none" stroke="var(--wolf-paw)" />
          <path d="M122 184Q130 181 138 184" fill="none" stroke="var(--wolf-paw)" />
        </g>

        <path
          className={styles.body}
          d="M72 112C80 97 94 90 111 90C130 90 146 99 153 115L153 157C146 174 130 181 111 181C91 181 75 173 68 157L68 124C68 119 69 115 72 112Z"
          fill="var(--wolf-fur)"
        />

        <g className={styles.leftArmGroup}>
          <path
            d="M77 111C62 115 54 129 55 145C56 159 64 169 73 168C80 166 81 158 76 153C71 146 72 137 82 130Z"
            fill="var(--wolf-fur-shade)"
          />
          <path
            d="M72 165C66 169 67 177 73 178C80 177 83 170 78 165Z"
            fill="var(--wolf-paw)"
          />
        </g>

        <g className={styles.rightArmGroup}>
          <path
            d="M146 111C161 115 169 129 167 145C166 159 158 169 149 168C142 166 141 158 146 153C151 146 150 137 140 130Z"
            fill="var(--wolf-fur)"
          />
          <path
            d="M150 165C156 169 155 177 149 178C142 177 139 170 144 165Z"
            fill="var(--wolf-paw)"
          />
        </g>

        <g className={styles.shirt}>
          <path
            d="M78 110L92 96C102 91 121 91 132 97L146 110L137 128L132 121L136 164C130 171 122 174 111 174C99 174 90 171 84 164L89 121L82 128L70 115Z"
            fill="white"
          />
          <path d="M78 110L92 96L96 108L82 128L70 115Z" fill="var(--google-blue)" stroke="none" />
          <path d="M132 97L146 110L137 128L124 108Z" fill="var(--google-red)" stroke="none" />
          <path
            d="M98 96Q111 104 125 97L121 108Q111 113 101 108Z"
            fill="var(--guide-surface)"
            stroke="var(--guide-line)"
            strokeWidth="1.8"
          />
          <path
            d="M92 116Q111 122 130 116"
            fill="none"
            stroke="var(--guide-line)"
            strokeWidth="1.4"
          />
          <g
            className={styles.googleBadge}
            transform="translate(96.6 123) scale(1.2)"
            stroke="none"
          >
            <path
              d="M23.49 12.27C23.49 11.48 23.42 10.73 23.3 10H12V14.51H18.47C18.19 15.96 17.37 17.19 16.07 18.04V20.98H19.95C22.23 18.88 23.49 15.78 23.49 12.27Z"
              fill="var(--google-blue)"
            />
            <path
              d="M12 24C15.24 24 17.96 22.93 19.95 21.09L16.07 18.15C14.99 18.87 13.61 19.3 12 19.3C8.87 19.3 6.22 17.19 5.27 14.35H1.25V17.39C3.24 21.34 7.31 24 12 24Z"
              fill="var(--google-green)"
            />
            <path
              d="M5.27 14.35C5.03 13.63 4.9 12.84 4.9 12C4.9 11.18 5.04 10.39 5.27 9.65V6.61H1.25C0.45 8.2 0 10.03 0 12C0 13.93 0.46 15.76 1.25 17.39L5.27 14.35Z"
              fill="var(--google-yellow)"
            />
            <path
              d="M12 4.7C13.76 4.7 15.34 5.31 16.59 6.5L20.03 3.06C17.95 1.12 15.24 0 12 0C7.31 0 3.24 2.66 1.25 6.61L5.27 9.65C6.22 6.81 8.87 4.7 12 4.7Z"
              fill="var(--google-red)"
            />
          </g>
        </g>

        <g className={styles.headGroup}>
          <path
            className={styles.leftEar}
            d="M77 47L61 11C59 6 64 3 68 7L94 28Z"
            fill="var(--wolf-fur-shade)"
          />
          <path d="M75 37L66 17L85 31Z" fill="var(--wolf-ear)" stroke="none" />
          <path
            className={styles.rightEar}
            d="M145 47L162 11C164 6 159 3 155 7L128 28Z"
            fill="var(--wolf-fur)"
          />
          <path d="M147 37L157 17L137 31Z" fill="var(--wolf-ear)" stroke="none" />

          <path
            className={styles.head}
            d="M72 47C80 27 94 20 111 20C131 20 147 31 154 49C163 60 163 79 157 93L162 101L151 104C141 117 126 124 110 124C93 124 79 117 70 104L60 101L65 93C60 76 62 58 72 47Z"
            fill="var(--wolf-fur)"
          />
          <path
            className={styles.faceCream}
            d="M73 61C77 45 91 39 104 45L111 53L119 45C134 39 149 50 152 66C156 84 145 103 129 112C119 118 103 117 93 111C77 102 68 80 73 61Z"
            fill="var(--wolf-cream)"
            stroke="none"
          />
          <path
            d="M101 25Q111 19 121 25L117 47L111 58L105 47Z"
            fill="var(--wolf-cream)"
            stroke="none"
          />
          <path
            className={styles.muzzle}
            d="M88 79C92 69 102 67 111 74C120 67 131 70 135 80C140 92 129 105 111 106C94 106 83 93 88 79Z"
            fill="var(--wolf-muzzle)"
            stroke="none"
          />

          <g className={styles.baseEyes}>
            <ellipse cx="93" cy="65" rx="7.5" ry="8" fill="white" stroke="none" />
            <ellipse cx="129" cy="65" rx="7.5" ry="8" fill="white" stroke="none" />
            <g
              className={styles.pupils}
              style={{ transform: `translate(${eyeX}px, ${eyeY}px)` }}
            >
              <circle cx="93" cy="66" r="4" fill="var(--wolf-eye)" stroke="none" />
              <circle cx="129" cy="66" r="4" fill="var(--wolf-eye)" stroke="none" />
              <circle cx="91.7" cy="64.2" r="1.3" fill="white" stroke="none" />
              <circle cx="127.7" cy="64.2" r="1.3" fill="white" stroke="none" />
            </g>
          </g>

          <path
            className={styles.brows}
            d="M85 55Q93 51 101 55M121 55Q129 51 137 55"
            fill="none"
            stroke="var(--wolf-outline)"
            strokeWidth="2"
          />
          <path
            className={styles.eyelids}
            d="M85 66Q93 73 101 66M121 66Q129 73 137 66"
          />
          <path
            d="M105 82Q111 77 117 82Q115 89 111 89Q107 89 105 82Z"
            fill="var(--wolf-nose)"
            stroke="none"
          />
          <path
            className={styles.mouthLine}
            d="M111 89Q106 97 99 92M111 89Q116 97 123 92"
            fill="none"
            stroke="var(--wolf-nose)"
            strokeWidth="2.2"
          />
          <ellipse
            className={styles.mouthOpen}
            cx="111"
            cy="95"
            rx="7.5"
            ry="4.5"
            fill="var(--wolf-mouth)"
            stroke="var(--wolf-nose)"
            strokeWidth="1.8"
          />
          <ellipse cx="82" cy="86" rx="5" ry="2.4" fill="var(--wolf-blush)" stroke="none" />
          <ellipse cx="141" cy="86" rx="5" ry="2.4" fill="var(--wolf-blush)" stroke="none" />
        </g>
      </g>

      <g className={styles.thoughts} aria-hidden="true">
        <circle cx="160" cy="55" r="4" fill="var(--google-blue)" />
        <circle cx="173" cy="42" r="5" fill="var(--google-yellow)" />
        <path
          d="M188 23L192 17L196 23L203 24L198 29L199 36L192 33L186 36L187 29L182 24Z"
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
        <path d="M46 92L34 86M51 79L47 67" stroke="var(--google-yellow)" />
        <path d="M174 94L187 87M170 80L176 68" stroke="var(--google-blue)" />
      </g>
    </svg>
  );
}
