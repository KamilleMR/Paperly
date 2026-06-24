// ─── Paperly Design Tokens ───────────────────────────────────────────────────
export const Colors = {
  // Primary palette
  ink:        '#1A1A2E',   // deep navy-black — primary text & backgrounds
  inkLight:   '#2D2D4E',   // slightly lifted ink for cards
  cream:      '#FAF7F2',   // warm off-white — main background
  creamDark:  '#F0EBE1',   // subtle section divider

  // Accent
  coral:      '#E8614D',   // signature coral — CTAs, badges, highlights
  coralLight: '#FDECEA',   // coral tint for tags/chips
  coralDark:  '#C44A38',   // pressed state

  // Neutrals
  slate:      '#6B7280',   // secondary text
  silver:     '#D1D5DB',   // borders, dividers
  white:      '#FFFFFF',

  // Status
  success:    '#22C55E',
  warning:    '#F59E0B',
};

export const Typography = {
  // Display (used sparingly, characterful)
  display: {
    fontFamily: 'Georgia',   // elegant serif for brand moments
    fontWeight: '700',
    letterSpacing: -1,
  },
  // Heading
  h1: { fontSize: 28, fontWeight: '700', color: Colors.ink, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', color: Colors.ink, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600', color: Colors.ink },
  h4: { fontSize: 15, fontWeight: '600', color: Colors.ink },
  // Body
  body:    { fontSize: 14, fontWeight: '400', color: Colors.ink, lineHeight: 22 },
  bodyS:   { fontSize: 12, fontWeight: '400', color: Colors.slate, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '500', color: Colors.slate, letterSpacing: 0.4 },
  // UI
  button:  { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  price:   { fontSize: 18, fontWeight: '800', color: Colors.ink },
  tag:     { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const Radius = {
  sm:   8,
  md:   14,
  lg:   20,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};
