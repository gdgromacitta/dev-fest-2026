/**
 * Path to the Roma Tre venue-partner logo.
 *
 * The asset is not available yet and usage permission from the university
 * is still unconfirmed (see issue #26). This app is a static export, so
 * there is no way to detect a file's presence at request time -- the path
 * must be resolvable at build time.
 *
 * Once the logo is cleared, drop it into `public/logos/` and set this
 * constant to its path (e.g. "/logos/roma-tre.svg"), then rebuild. Adding
 * the asset alone is not sufficient -- this one constant also has to flip.
 * While it is `null`, the slot renders nothing: no broken image icon, no
 * reserved gap, no layout shift.
 */
export const venuePartnerLogoPath: string | null = null;
